import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/logs - Get all logs with optional filtering
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    const severity = searchParams.get('severity');
    
    // Build the query
    let query: any = {};
    
    if (pageId) {
      query.pageId = pageId;
    }
    
    if (severity) {
      query.severity = severity;
    }
    
    const logs = await prisma.log.findMany({
      where: query,
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        page: true,
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    
    // Check if the error is because the table doesn't exist
    if (error.code === 'P2021') {
      console.log('The Log table does not exist. Returning empty array.');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}

// POST /api/logs - Create a new log
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.message || !body.severity || !body.pageId) {
      return NextResponse.json(
        { error: 'Message, severity, and pageId are required' },
        { status: 400 }
      );
    }

    // Validate severity value
    const validSeverities = ['info', 'warning', 'error', 'debug', 'critical'];
    if (!validSeverities.includes(body.severity)) {
      return NextResponse.json(
        { error: `Severity must be one of: ${validSeverities.join(', ')}` },
        { status: 400 }
      );
    }

    // For testing purposes, we'll use the same test user as in the pages API
    let userId;

    try {
      // Check if our test user already exists
      const existingUser = await prisma.user.findUnique({
        where: {
          email: "test@example.com"
        }
      });

      if (existingUser) {
        // Use the existing user's ID
        userId = existingUser.id;
        console.log('Using existing test user with ID:', userId);
      } else {
        // Create a new user
        const newUser = await prisma.user.create({
          data: {
            name: "Test User",
            email: "test@example.com",
            password: "password123", // In a real app, this would be hashed
            role: "user",
          },
        });
        userId = newUser.id;
        console.log('Created test user with ID:', userId);
      }

      // Check if the page exists
      const page = await prisma.page.findUnique({
        where: {
          id: body.pageId
        }
      });

      if (!page) {
        return NextResponse.json(
          { error: 'Referenced page does not exist.' },
          { status: 400 }
        );
      }

      // Create the log entry
      const log = await prisma.log.create({
        data: {
          message: body.message,
          severity: body.severity,
          pageId: body.pageId,
          userId: userId,
        },
      });

      return NextResponse.json(log, { status: 201 });
    } catch (error: any) {
      console.error('Error in user/log creation process:', error);
      throw error; // Re-throw to be caught by the outer try/catch
    }
  } catch (error: any) {
    console.error('Error creating log:', error);

    // Check if the error is because the table doesn't exist
    if (error.code === 'P2021') {
      return NextResponse.json(
        { error: 'Database tables not initialized. Please run Prisma migrations.' },
        { status: 500 }
      );
    }

    // Check if the error is a foreign key constraint violation
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Referenced page or user does not exist.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create log' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/pages - Get all pages
export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);

    // Check if the error is because the table doesn't exist
    if (error.code === 'P2021') {
      console.log('The Page table does not exist. Returning empty array.');
      return NextResponse.json([]);
    }

    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

// POST /api/pages - Create a new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.emoji) {
      return NextResponse.json(
        { error: 'Title and emoji are required' },
        { status: 400 }
      );
    }

    // For testing purposes, we'll create a user and then use its ID for the page
    let userId;

    try {
      // First, check if our test user already exists
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
        // Create a new user (let Prisma generate the ID)
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

      // Now create the page with the correct user ID
      const page = await prisma.page.create({
        data: {
          title: body.title,
          emoji: body.emoji,
          userId: userId,
        },
      });

      return NextResponse.json(page, { status: 201 });
    } catch (error: any) {
      console.error('Error in user/page creation process:', error);
      throw error; // Re-throw to be caught by the outer try/catch
    }
  } catch (error: any) {
    console.error('Error creating page:', error);

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
        { error: 'Referenced user does not exist. Please create the user first.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}

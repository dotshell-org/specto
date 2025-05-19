import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/pages/[id] - Get a specific page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const page = await prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(page);
  } catch (error: any) {
    console.error('Error fetching page:', error);

    // Check if the error is because the table doesn't exist
    if (error.code === 'P2021') {
      return NextResponse.json(
        { error: 'Page not found - database tables not initialized' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

// PUT /api/pages/[id] - Update a specific page
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.emoji) {
      return NextResponse.json(
        { error: 'Title and emoji are required' },
        { status: 400 }
      );
    }

    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id },
    });

    if (!existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Update the page
    const updatedPage = await prisma.page.update({
      where: { id },
      data: {
        title: body.title,
        emoji: body.emoji,
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error: any) {
    console.error('Error updating page:', error);

    // Check if the error is because the table doesn't exist
    if (error.code === 'P2021') {
      return NextResponse.json(
        { error: 'Page not found - database tables not initialized' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

// DELETE /api/pages/[id] - Delete a specific page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id },
    });

    if (!existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Delete the page
    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting page:', error);

    // Check if the error is because the table doesn't exist
    if (error.code === 'P2021') {
      return NextResponse.json(
        { error: 'Page not found - database tables not initialized' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}

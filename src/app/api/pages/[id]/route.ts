import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to extract the [id] param from the URL
function getIdFromRequest(request: NextRequest): string | null {
  const url = new URL(request.url);
  // /api/pages/[id] => get last segment
  const segments = url.pathname.split('/');
  return segments.length > 0 ? segments[segments.length - 1] : null;
}

// GET /api/pages/[id] - Get a specific page
export async function GET(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing page id' }, { status: 400 });
    }

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
  } catch (error) {
    console.error('Error fetching page:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2021') {
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
export async function PUT(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing page id' }, { status: 400 });
    }
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
  } catch (error) {
    console.error('Error updating page:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2021') {
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
export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing page id' }, { status: 400 });
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
    // Delete the page
    await prisma.page.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2021') {
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

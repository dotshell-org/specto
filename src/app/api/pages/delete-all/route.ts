import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/pages/delete-all - Delete all pages
export async function DELETE() {
  try {
    // For now, we'll use a hardcoded user ID
    // In a real app, you would get this from the authenticated user
    const userId = "user1"; // Placeholder - would come from auth

    // Delete all pages for the user
    await prisma.page.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting all pages:', error);

    // Check if the error is because the table doesn't exist
    if (error.code === 'P2021') {
      // If the table doesn't exist, we can consider it as already "deleted"
      console.log('The Page table does not exist. Considering all pages deleted.');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Failed to delete all pages' },
      { status: 500 }
    );
  }
}

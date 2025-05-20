import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/logs/patterns - Detect log patterns (simple example)
export async function GET(request: NextRequest) {
  try {
    // Example: Find most common error messages (top 3)
    const patterns = await prisma.log.groupBy({
      by: ['message'],
      _count: { message: true },
      orderBy: { _count: { message: 'desc' } },
      take: 3,
    });
    return NextResponse.json(patterns);
  } catch (error) {
    console.error('Error detecting patterns:', error);
    return NextResponse.json({ error: 'Failed to detect patterns' }, { status: 500 });
  }
}

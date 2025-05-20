import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/logs/performance - Simple performance metrics
export async function GET(request: NextRequest) {
  try {
    // Example: Count logs by type related to performance
    const slowQueries = await prisma.log.count({
      where: { message: { contains: 'slow query' } },
    });
    const timeouts = await prisma.log.count({
      where: { message: { contains: 'timeout' } },
    });
    const apiDelays = await prisma.log.count({
      where: { message: { contains: 'API delay' } },
    });
    return NextResponse.json({ slowQueries, timeouts, apiDelays });
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    return NextResponse.json({ error: 'Failed to get performance metrics' }, { status: 500 });
  }
}

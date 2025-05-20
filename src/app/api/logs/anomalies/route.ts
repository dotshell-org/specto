import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/logs/anomalies - Detect anomalies (simple example)
export async function GET(request: NextRequest) {
  try {
    // Example: Find error spikes in the last 24h
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const errorLogs = await prisma.log.findMany({
      where: {
        severity: { in: ['error', 'critical'] },
        timestamp: { gte: since },
      },
      orderBy: { timestamp: 'desc' },
      take: 10,
    });
    return NextResponse.json(errorLogs);
  } catch (error) {
    console.error('Error detecting anomalies:', error);
    return NextResponse.json({ error: 'Failed to detect anomalies' }, { status: 500 });
  }
}

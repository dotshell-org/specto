import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/logs/analytics - Get analytics data for logs
export async function GET(request: NextRequest) {
  try {
    // Get total logs count
    const totalLogs = await prisma.log.count();

    // Get count of logs by severity
    const severityCounts = await prisma.log.groupBy({
      by: ['severity'],
      _count: {
        id: true
      }
    });

    // Calculate severity distribution percentages
    const severityDistribution: Record<string, number> = {
      info: 0,
      warning: 0,
      error: 0,
      debug: 0,
      critical: 0
    };

    if (totalLogs > 0) {
      severityCounts.forEach(item => {
        const percentage = Math.round((item._count.id / totalLogs) * 100);
        severityDistribution[item.severity] = percentage;
      });
    }

    // Get count of error and critical logs
    const errorCount = await prisma.log.count({
      where: {
        severity: 'error'
      }
    });

    const criticalCount = await prisma.log.count({
      where: {
        severity: 'critical'
      }
    });

    // Calculate error rate
    const errorRate = totalLogs > 0 
      ? Math.round(((errorCount + criticalCount) / totalLogs) * 1000) / 10
      : 0;

    // Get top pages by log count
    const topPages = await prisma.log.groupBy({
      by: ['pageId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 3
    });

    // Get page details for top pages
    const topPagesWithDetails = await Promise.all(
      topPages.map(async (item) => {
        const page = await prisma.page.findUnique({
          where: {
            id: item.pageId
          },
          select: {
            id: true,
            title: true,
            emoji: true
          }
        });

        return {
          id: item.pageId,
          name: page ? `${page.emoji} ${page.title}` : 'Unknown Page',
          count: item._count.id
        };
      })
    );

    // Construct the analytics object
    const analytics = {
      totalLogs,
      errorRate,
      criticalIssues: criticalCount,
      topPages: topPagesWithDetails,
      severityDistribution
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error generating log analytics:', error);
    
    // Check if the error is because the table doesn't exist
    if (error.code === 'P2021') {
      console.log('The Log table does not exist. Returning empty analytics.');
      return NextResponse.json({
        totalLogs: 0,
        errorRate: 0,
        criticalIssues: 0,
        topPages: [],
        severityDistribution: {
          info: 0,
          warning: 0,
          error: 0,
          debug: 0,
          critical: 0
        }
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to generate log analytics' },
      { status: 500 }
    );
  }
}
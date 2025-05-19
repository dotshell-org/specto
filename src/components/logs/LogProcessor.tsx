import React, { useState, useEffect } from 'react';
import { Log, LogSeverity } from '@/types/logs/Log';
import { CustomPage } from '@/types/nav/CustomPage';
import { Search, Filter, RefreshCw, Download, Calendar, AlertCircle, Info, AlertTriangle, Bug, Zap, BarChart2, PieChart, TrendingUp, Layers, Cpu } from 'lucide-react';
import LogViewer from './LogViewer';

interface LogProcessorProps {
  customPages: CustomPage[];
}

interface LogAnalytics {
  totalLogs: number;
  errorRate: number;
  criticalIssues: number;
  topPages: {
    id: string;
    name: string;
    count: number;
  }[];
  severityDistribution: {
    info: number;
    warning: number;
    error: number;
    debug: number;
    critical: number;
  };
}

const LogProcessor: React.FC<LogProcessorProps> = ({ customPages }) => {
  const [activeView, setActiveView] = useState<'analytics' | 'patterns' | 'anomalies' | 'performance'>('analytics');
  const [analytics, setAnalytics] = useState<LogAnalytics>({
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch analytics data when component mounts or when activeView changes to 'analytics'
  useEffect(() => {
    if (activeView === 'analytics') {
      fetchAnalytics();
    }
  }, [activeView]);

  // Function to fetch analytics data from the API
  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/logs/analytics');

      if (!response.ok) {
        throw new Error(`Error fetching analytics: ${response.status}`);
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Keep the existing analytics in case of error
    } finally {
      setIsLoading(false);
    }
  };

  const renderViewContent = () => {
    switch (activeView) {
      case 'analytics':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Log Analytics</h2>
              <button 
                onClick={fetchAnalytics} 
                className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Total Logs</h3>
                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{analytics.totalLogs}</p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-1">Error Rate</h3>
                    <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">{analytics.errorRate}%</p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Critical Issues</h3>
                    <p className="text-2xl font-bold text-red-800 dark:text-red-200">{analytics.criticalIssues}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Severity Distribution</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                        <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${analytics.severityDistribution.info}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Info {analytics.severityDistribution.info}%</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                        <div className="bg-yellow-500 h-4 rounded-full" style={{ width: `${analytics.severityDistribution.warning}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Warning {analytics.severityDistribution.warning}%</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                        <div className="bg-red-500 h-4 rounded-full" style={{ width: `${analytics.severityDistribution.error}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Error {analytics.severityDistribution.error}%</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                        <div className="bg-green-500 h-4 rounded-full" style={{ width: `${analytics.severityDistribution.debug}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Debug {analytics.severityDistribution.debug}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                        <div className="bg-purple-500 h-4 rounded-full" style={{ width: `${analytics.severityDistribution.critical}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Critical {analytics.severityDistribution.critical}%</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Top Pages by Log Count</h3>
                    {analytics.topPages.length > 0 ? (
                      <ul className="space-y-2">
                        {analytics.topPages.map((page, index) => (
                          <li key={page.id} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {index + 1}. {page.name}
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{page.count}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No logs found for any pages.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'patterns':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Log Patterns</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Intelligent pattern detection identifies common log sequences and recurring issues.
            </p>

            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Database Connection Issues</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Pattern detected: Database connection failures followed by automatic reconnection attempts
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded text-xs mr-2">
                    12 occurrences
                  </span>
                  <span>Last seen: 2 hours ago</span>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Authentication Failures</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Pattern detected: Multiple failed login attempts from same IP addresses
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded text-xs mr-2">
                    8 occurrences
                  </span>
                  <span>Last seen: 30 minutes ago</span>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">API Rate Limiting</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Pattern detected: Rate limit exceeded errors during peak usage hours
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded text-xs mr-2">
                    5 occurrences
                  </span>
                  <span>Last seen: 1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'anomalies':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Anomaly Detection</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Unusual patterns and outliers that may indicate potential issues.
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-r-lg">
                <h3 className="font-medium text-red-800 dark:text-red-300 mb-1">Critical Anomaly Detected</h3>
                <p className="text-sm text-red-700 dark:text-red-400 mb-2">
                  Sudden spike in error logs from the Authentication service (15x normal rate)
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-red-600 dark:text-red-400">Detected 15 minutes ago</span>
                  <button className="text-xs bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-1 rounded hover:bg-red-200 dark:hover:bg-red-700">
                    Investigate
                  </button>
                </div>
              </div>

              <div className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-r-lg">
                <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Warning Anomaly</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">
                  Unusual pattern of database query timeouts on the Dashboard page
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-yellow-600 dark:text-yellow-400">Detected 1 hour ago</span>
                  <button className="text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded hover:bg-yellow-200 dark:hover:bg-yellow-700">
                    Investigate
                  </button>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Info Anomaly</h3>
                <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                  Unusual increase in user registration activity outside normal business hours
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-600 dark:text-blue-400">Detected 3 hours ago</span>
                  <button className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-700">
                    Investigate
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Performance Insights</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Performance metrics and optimization recommendations based on log analysis.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Response Time Trends</h3>
                <div className="h-40 flex items-end space-x-2">
                  {[35, 28, 45, 50, 75, 62, 48, 30, 25, 40, 55, 70].map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t" 
                        style={{ height: `${value}%` }}
                      ></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{index + 1}</span>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">Hours (last 12)</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Slow Operations</h3>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Database Queries</span>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">350ms avg</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">API Requests</span>
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">180ms avg</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">File Operations</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">75ms avg</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Authentication</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">90ms avg</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-green-800 dark:text-green-300 mb-2 flex items-center">
                <Cpu className="h-4 w-4 mr-1" />
                Optimization Recommendations
              </h3>
              <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Add database index on 'timestamp' column to improve query performance</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Implement caching for frequently accessed API endpoints</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Optimize image loading on Dashboard page to reduce load times</span>
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Log Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please select a view from the options above to see log analytics, patterns, anomalies, or performance insights.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-4 p-4">
        <div className="flex flex-wrap gap-2">

          <button
            onClick={() => setActiveView('analytics')}
            className={`px-4 py-2 rounded-md flex items-center ${
              activeView === 'analytics'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Analytics
          </button>

          <button
            onClick={() => setActiveView('patterns')}
            className={`px-4 py-2 rounded-md flex items-center ${
              activeView === 'patterns'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <PieChart className="h-4 w-4 mr-2" />
            Patterns
          </button>

          <button
            onClick={() => setActiveView('anomalies')}
            className={`px-4 py-2 rounded-md flex items-center ${
              activeView === 'anomalies'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Anomalies
          </button>

          <button
            onClick={() => setActiveView('performance')}
            className={`px-4 py-2 rounded-md flex items-center ${
              activeView === 'performance'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance
          </button>
        </div>
      </div>

      {renderViewContent()}
    </div>
  );
};

export default LogProcessor;

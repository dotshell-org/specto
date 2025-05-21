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

  // Patterns state
  const [patterns, setPatterns] = useState<any[]>([]);
  // Anomalies state
  const [anomalies, setAnomalies] = useState<any[]>([]);
  // Performance state
  const [performance, setPerformance] = useState<any | null>(null);

  // Fetch analytics data when component mounts or when activeView changes
  useEffect(() => {
    if (activeView === 'analytics') {
      fetchAnalytics();
    } else if (activeView === 'patterns') {
      fetchPatterns();
    } else if (activeView === 'anomalies') {
      fetchAnomalies();
    } else if (activeView === 'performance') {
      fetchPerformance();
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
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch patterns from the API
  const fetchPatterns = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/logs/patterns');
      if (!response.ok) throw new Error('Error fetching patterns');
      const data = await response.json();
      setPatterns(data);
    } catch (error) {
      console.error('Failed to fetch patterns:', error);
      setPatterns([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch anomalies from the API
  const fetchAnomalies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/logs/anomalies');
      if (!response.ok) throw new Error('Error fetching anomalies');
      const data = await response.json();
      setAnomalies(data);
    } catch (error) {
      console.error('Failed to fetch anomalies:', error);
      setAnomalies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch performance from the API
  const fetchPerformance = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/logs/performance');
      if (!response.ok) throw new Error('Error fetching performance');
      const data = await response.json();
      setPerformance(data);
    } catch (error) {
      console.error('Failed to fetch performance:', error);
      setPerformance(null);
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
                className="flex items-center text-sm cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all"
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
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : patterns.length > 0 ? (
              <ul className="space-y-4">
                {patterns.map((pattern, idx) => (
                  <li key={idx} className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg flex items-center justify-between">
                    <div>
                      <div className="font-medium text-blue-800 dark:text-blue-300 mb-1">{pattern.message}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Occurrences: {pattern._count.message}</div>
                    </div>
                    <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded text-xs font-bold">Pattern</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No patterns detected.</p>
            )}
          </div>
        );
      case 'anomalies':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Anomaly Detection</h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : anomalies.length > 0 ? (
              <ul className="space-y-4">
                {anomalies.map((log, idx) => (
                  <li key={idx} className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-r-lg flex items-center justify-between">
                    <div>
                      <div className="font-medium text-red-800 dark:text-red-300 mb-1">{log.message}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(log.timestamp).toLocaleString()}</div>
                    </div>
                    <span className="inline-block bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded text-xs font-bold">Anomaly</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No anomalies detected.</p>
            )}
          </div>
        );
      case 'performance':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Performance Insights</h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : performance ? (
              <ul className="space-y-4">
                <li className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-4 rounded-r-lg flex items-center justify-between">
                  <span className="font-medium text-green-800 dark:text-green-300">Slow Queries</span>
                  <span className="font-bold text-green-800 dark:text-green-300">{performance.slowQueries}</span>
                </li>
                <li className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-r-lg flex items-center justify-between">
                  <span className="font-medium text-yellow-800 dark:text-yellow-300">Timeouts</span>
                  <span className="font-bold text-yellow-800 dark:text-yellow-300">{performance.timeouts}</span>
                </li>
                <li className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg flex items-center justify-between">
                  <span className="font-medium text-blue-800 dark:text-blue-300">API Delays</span>
                  <span className="font-bold text-blue-800 dark:text-blue-300">{performance.apiDelays}</span>
                </li>
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No performance data.</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="pt-2">
      <div>
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={() => setActiveView('analytics')} 
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 \
            ${activeView === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'} cursor-pointer`}
            type="button"
          >
            <BarChart2 className="w-5 h-5" />
            <span>Analytics</span>
          </button>
          <button 
            onClick={() => setActiveView('patterns')} 
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 \
            ${activeView === 'patterns' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'} cursor-pointer`}
            type="button"
          >
            <Zap className="w-5 h-5" />
            <span>Patterns</span>
          </button>
          <button 
            onClick={() => setActiveView('anomalies')} 
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 \
            ${activeView === 'anomalies' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'} cursor-pointer`}
            type="button"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Anomalies</span>
          </button>
          <button 
            onClick={() => setActiveView('performance')} 
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 \
            ${activeView === 'performance' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'} cursor-pointer`}
            type="button"
          >
            <Cpu className="w-5 h-5" />
            <span>Performance</span>
          </button>
        </div>
      </div>
      {renderViewContent()}
    </div>
  );
};

export default LogProcessor;

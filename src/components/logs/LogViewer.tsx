"use client"

import React, { useState, useEffect } from 'react';
import { Log, LogSeverity } from '@/types/logs/Log';
import { CustomPage } from '@/types/nav/CustomPage';
import { Search, Filter, RefreshCw, Download, Calendar, AlertCircle, Info, AlertTriangle, Bug, Zap } from 'lucide-react';

interface LogViewerProps {
  customPages: CustomPage[];
  initialPageFilter?: string;
}

// Mock data for demonstration
const mockLogs: Log[] = [
  {
    id: '1',
    timestamp: new Date(),
    severity: LogSeverity.Info,
    message: 'Application started successfully',
    pageId: '1',
    userId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    severity: LogSeverity.Warning,
    message: 'High memory usage detected',
    additionalData: { memoryUsage: '85%', threshold: '80%' },
    pageId: '1',
    userId: '1',
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000)
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    severity: LogSeverity.Error,
    message: 'Failed to connect to database',
    additionalData: { error: 'Connection timeout', retries: 3 },
    pageId: '2',
    userId: '1',
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 7200000)
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    severity: LogSeverity.Debug,
    message: 'Processing user request',
    additionalData: { requestId: '12345', endpoint: '/api/data' },
    pageId: '2',
    userId: '1',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000)
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    severity: LogSeverity.Critical,
    message: 'System crash detected',
    additionalData: { errorCode: 'SEGFAULT', stackTrace: 'Error at line 42' },
    pageId: '3',
    userId: '1',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000)
  }
];

const LogViewer: React.FC<LogViewerProps> = ({ customPages, initialPageFilter }) => {
  const [logs, setLogs] = useState<Log[]>(mockLogs);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPage, setSelectedPage] = useState<string | 'all'>(initialPageFilter || 'all');
  const [selectedSeverity, setSelectedSeverity] = useState<LogSeverity | 'all'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Apply filters when any filter changes
  useEffect(() => {
    let filtered = logs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(log.additionalData).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by page
    if (selectedPage !== 'all') {
      filtered = filtered.filter(log => log.pageId === selectedPage);
    }

    // Filter by severity
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(log => log.severity === selectedSeverity);
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(log => log.timestamp >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of the day
      filtered = filtered.filter(log => log.timestamp <= end);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, selectedPage, selectedSeverity, startDate, endDate]);

  // Function to refresh logs (would fetch from API in a real implementation)
  const refreshLogs = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLogs(mockLogs);
      setIsLoading(false);
    }, 500);
  };

  // Function to export logs as JSON
  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `logs-export-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Get severity icon based on log severity
  const getSeverityIcon = (severity: LogSeverity) => {
    switch (severity) {
      case LogSeverity.Info:
        return <Info className="h-5 w-5 text-blue-500" />;
      case LogSeverity.Warning:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case LogSeverity.Error:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case LogSeverity.Debug:
        return <Bug className="h-5 w-5 text-green-500" />;
      case LogSeverity.Critical:
        return <Zap className="h-5 w-5 text-purple-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get severity class for styling
  const getSeverityClass = (severity: LogSeverity) => {
    switch (severity) {
      case LogSeverity.Info:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case LogSeverity.Warning:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case LogSeverity.Error:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case LogSeverity.Debug:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case LogSeverity.Critical:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filter section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4 p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Page filter */}
          <div className="w-full md:w-48">
            <select
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
            >
              <option value="all">All Pages</option>
              {customPages.map(page => (
                <option key={page.id} value={page.id}>
                  {page.emoji} {page.title}
                </option>
              ))}
            </select>
          </div>

          {/* Severity filter */}
          <div className="w-full md:w-48">
            <select
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as LogSeverity | 'all')}
            >
              <option value="all">All Severities</option>
              {Object.values(LogSeverity).map(severity => (
                <option key={severity} value={severity}>
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Date range */}
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={refreshLogs}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
              disabled={isLoading}
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={exportLogs}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            >
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Logs list */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Severity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Message
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Page
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Additional Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => {
                  // Find the page name
                  const page = customPages.find(p => p.id === log.pageId);

                  return (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityClass(log.severity)}`}>
                            {getSeverityIcon(log.severity)}
                            <span className="ml-1">{log.severity}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {log.timestamp.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {log.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {page ? (
                          <span className="flex items-center">
                            <span className="mr-1">{page.emoji}</span>
                            {page.title}
                          </span>
                        ) : (
                          `Unknown (${log.pageId})`
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {log.additionalData ? (
                          <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.additionalData, null, 2)}
                          </pre>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">None</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No logs found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;

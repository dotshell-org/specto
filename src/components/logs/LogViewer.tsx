"use client"

import React, { useState, useEffect } from 'react';
import { Log, LogSeverity } from '@/types/logs/Log';
import { Search, RefreshCw, Download, Calendar, AlertCircle, Info, AlertTriangle, Bug, Zap, Trash2 } from 'lucide-react';

interface LogViewerProps {
  initialPageFilter?: string;
}

const LogViewer: React.FC<LogViewerProps> = ({ initialPageFilter }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPage, setSelectedPage] = useState<string | 'all'>(initialPageFilter || 'all');
  const [selectedSeverity, setSelectedSeverity] = useState<LogSeverity | 'all'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(50);

  // Helper to get API base path from env
  const getApiBasePath = () => {
    if (typeof window !== 'undefined') {
      return process.env.NEXT_PUBLIC_BASE_PATH || '';
    }
    return '';
  };

  // Fetch logs when component mounts or when initialPageFilter changes
  useEffect(() => {
    if (initialPageFilter && initialPageFilter !== selectedPage) {
      setSelectedPage(initialPageFilter);
    }
    refreshLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPageFilter]);

  // Apply filters when any filter changes
  useEffect(() => {
    let filtered = logs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Reset visibleCount when filters or logs change
  useEffect(() => {
    setVisibleCount(50);
  }, [logs, searchTerm, selectedPage, selectedSeverity, startDate, endDate]);

  // Function to refresh logs from the API
  const refreshLogs = async () => {
    setIsLoading(true);
    try {
      // Build the query parameters
      const queryParams = new URLSearchParams();

      if (selectedPage !== 'all') {
        queryParams.append('pageId', selectedPage);
      }

      if (selectedSeverity !== 'all') {
        queryParams.append('severity', selectedSeverity);
      }

      // Fetch logs from the API
      const response = await fetch(`${getApiBasePath()}/api/logs?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Error fetching logs: ${response.status}`);
      }

      const data: ApiLog[] = await response.json();

      // Convert string dates to Date objects
      const processedLogs: Log[] = data.map((log) => ({
        ...log,
        timestamp: new Date(log.timestamp),
        createdAt: new Date(log.createdAt),
        updatedAt: new Date(log.updatedAt)
      }));

      setLogs(processedLogs);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      // Keep the existing logs in case of error
    } finally {
      setIsLoading(false);
    }
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

  // Function to delete a log
  const deleteLog = async (id: string) => {
    try {
      const response = await fetch(`${getApiBasePath()}/api/logs?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete log');
      // Refresh logs after deletion
      refreshLogs();
    } catch (error) {
      alert('Error deleting log');
      console.error(error);
    }
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
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-4 p-4">
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

          {/* Severity filter */}
          <div className="w-full md:w-48">
            <select
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSeverity}
              onChange={(e) => {
                setSelectedSeverity(e.target.value as LogSeverity | 'all');
                refreshLogs(); // Auto-refresh logs on severity change
              }}
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
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center cursor-pointer transition-all"
              disabled={isLoading}
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={exportLogs}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center cursor-pointer transition-all"
            >
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Logs list */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.length > 0 ? (
                filteredLogs.slice(0, visibleCount).map(log => {
                  return (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
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
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => deleteLog(log.id)}
                          className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                          title="Delete log"
                        >
                          <Trash2 className="h-5 w-5 text-red-600 cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No logs found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination: Show more button */}
        {visibleCount < filteredLogs.length && (
          <div className="flex justify-center py-4">
            <button
              onClick={() => setVisibleCount(v => v + 50)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Type for logs as received from API (dates as string)
type ApiLog = Omit<Log, 'timestamp' | 'createdAt' | 'updatedAt'> & {
  timestamp: string;
  createdAt: string;
  updatedAt: string;
};

export default LogViewer;

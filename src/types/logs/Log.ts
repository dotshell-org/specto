export enum LogSeverity {
  Info = "info",
  Warning = "warning",
  Error = "error",
  Debug = "debug",
  Critical = "critical"
}

export interface Log {
  id: string;
  timestamp: Date;
  severity: LogSeverity;
  message: string;
  additionalData?: Record<string, any>;
  pageId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
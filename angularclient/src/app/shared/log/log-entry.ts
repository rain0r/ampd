import { LogLevel } from "./log-level";

export class LogEntry {
  entryDate: Date = new Date();
  message = "";
  level: LogLevel = LogLevel.Debug;
  extraInfo: unknown[] = [];
  logWithDate = true;
}

import { Injectable, inject } from "@angular/core";
import { LogLevel } from "../shared/log/log-level";
import { LogEntry } from "../shared/log/log-entry";
import { LogPublisher } from "../shared/log/log-publisher";
import { LogPublishersService } from "./log-publishers.service";

@Injectable({
  providedIn: "root",
})
export class LoggerService {
  private publishersService = inject(LogPublishersService);

  level: LogLevel = LogLevel.All;
  logWithDate = true;
  publishers: LogPublisher[];

  constructor() {
    // Set publishers
    this.publishers = this.publishersService.publishers;
  }

  debug(msg: string, ...optionalParams: unknown[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  info(msg: string, ...optionalParams: unknown[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  warn(msg: string, ...optionalParams: unknown[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  error(msg: string, ...optionalParams: unknown[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  fatal(msg: string, ...optionalParams: unknown[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  log(msg: string, ...optionalParams: unknown[]) {
    this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  private writeToLog(msg: string, level: LogLevel, params: unknown[]) {
    if (this.shouldLog(level)) {
      const entry: LogEntry = new LogEntry();
      entry.message = msg;
      entry.level = level;
      entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;
      for (const logger of this.publishers) {
        logger.log(entry).subscribe(() => void 0);
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    let ret = false;
    if (
      (level >= this.level && level !== LogLevel.Off) ||
      this.level === LogLevel.All
    ) {
      ret = true;
    }
    return ret;
  }
}

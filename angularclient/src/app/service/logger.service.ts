import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { LogLevel } from "../shared/log-level";

@Injectable({
  providedIn: "root",
})
export class LoggerService {
  debug(msg: string, data: unknown | null = null): void {
    this.logWith(LogLevel.Debug, msg, data);
  }

  info(msg: string, data: unknown | null): void {
    this.logWith(LogLevel.Info, msg, data);
  }

  warn(msg: string, data: unknown | null): void {
    this.logWith(LogLevel.Warn, msg, data);
  }

  error(msg: string, data: unknown | null): void {
    this.logWith(LogLevel.Error, msg, data);
  }

  private logWith(level: LogLevel, msg: string, data: unknown): void {
    data = data ? data : " ";
    switch (level) {
      case LogLevel.Debug:
        if (environment.production === false) {
          console.info("%c" + msg, "color: #6c757d", data);
        }
        break;
      case LogLevel.Info:
        console.info("%c" + msg, "color: #6495ED", data);
        break;
      case LogLevel.Warn:
        console.warn("%c" + msg, "color: #FF8C00", data);
        break;
      case LogLevel.Error:
        console.error("%c" + msg, data, "color: #DC143C", data);
        break;
      default:
        console.debug(msg);
    }
  }
}

import { Pipe, PipeTransform } from "@angular/core";
import { LogLevel } from "../log/log-level";

@Pipe({ name: "logLevel" })
export class LogLevelPipe implements PipeTransform {
  transform(value: number): string {
    return LogLevel[value];
  }
}

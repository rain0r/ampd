import { Observable, of } from "rxjs";
import { LogEntry } from "./log-entry";
import { LogPublisher } from "./log-publisher";

export class LogConsole extends LogPublisher {
  log(entry: LogEntry): Observable<boolean> {
    // Log to console
    console.debug(entry.message, entry.extraInfo);
    return of(true);
  }

  clear(): Observable<boolean> {
    console.clear();
    return of(true);
  }
}

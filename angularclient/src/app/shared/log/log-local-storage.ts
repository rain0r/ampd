import { Observable, of } from "rxjs";
import { LogEntry } from "./log-entry";
import { LogPublisher } from "./log-publisher";

export const LS_LOG_NAME = "logging";
export const MAX_ENTRIES = 50;

export class LogLocalStorage extends LogPublisher {
  constructor() {
    // Must call `super()`from derived classes
    super();

    // Set location
    this.location = LS_LOG_NAME;
  }

  // Append log entry to local storage
  log(entry: LogEntry): Observable<boolean> {
    let ret = false;
    let values: LogEntry[];

    try {
      // Get previous values from local storage
      values = JSON.parse(localStorage.getItem(this.location) || "[]") || [];

      // Keep max MAX_ENTRIES entries
      if (values.length == MAX_ENTRIES) {
        values = values.slice(1);
      }

      // Add new log entry to array
      values.push(entry);

      // Store array into local storage
      localStorage.setItem(this.location, JSON.stringify(values));

      // Set return value
      ret = true;
    } catch (ex) {
      // Display error in console
      console.error(ex);
    }

    return of(ret);
  }

  // Clear all log entries from local storage
  clear(): Observable<boolean> {
    localStorage.removeItem(this.location);
    return of(true);
  }
}

import { Observable } from "rxjs";
import { LogEntry } from "./log-entry";

export abstract class LogPublisher {
  location = "";
  abstract log(record: LogEntry): Observable<boolean>;
  abstract clear(): Observable<boolean>;
}

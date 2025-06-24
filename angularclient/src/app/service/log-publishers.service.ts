import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { LogConsole } from "../shared/log/log-console";
import { LogLocalStorage } from "../shared/log/log-local-storage";
import { LogPublisher } from "../shared/log/log-publisher";
import { LogPublisherConfig } from "../shared/log/log-publisher-conf";

const PUBLISHERS_FILE = "assets/log-publishers.json";

@Injectable({
  providedIn: "root",
})
export class LogPublishersService {
  private http = inject(HttpClient);

  publishers: LogPublisher[] = [];

  constructor() {
    this.buildPublishers();
  }

  buildPublishers(): void {
    let logPub: LogPublisher;

    this.getLoggers().subscribe((response) => {
      for (const pub of response.filter((p) => p.isActive)) {
        switch (pub.loggerName.toLowerCase()) {
          case "console":
            logPub = new LogConsole();
            break;
          case "localstorage":
            logPub = new LogLocalStorage();
            break;
        }

        // Set location of logging
        logPub.location = pub.loggerLocation;

        // Add publisher to array
        this.publishers.push(logPub);
      }
    });
  }

  getLoggers(): Observable<LogPublisherConfig[]> {
    return this.http.get<LogPublisherConfig[]>(PUBLISHERS_FILE);
  }
}

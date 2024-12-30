import { Component } from "@angular/core";
import { LogEntry } from "../../shared/log/log-entry";
import { LS_LOG_NAME } from "../../shared/log/log-local-storage";

@Component({
  selector: "app-log-view",
  standalone: false,
  templateUrl: "./log-view.component.html",
  styleUrl: "./log-view.component.css",
})
export class LogViewComponent {
  logEntries: LogEntry[] = [];
  displayedColumns: string[] = ["entryDate", "message", "level", "extraInfo"];

  constructor() {
    this.localStorageLog();
  }

  clearLogs(): void {
    localStorage.removeItem(LS_LOG_NAME);
  }

  private localStorageLog(): void {
    this.logEntries =
      JSON.parse(localStorage.getItem(LS_LOG_NAME) || "[]") || [];
  }
}

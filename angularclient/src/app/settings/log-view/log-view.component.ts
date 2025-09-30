import { DatePipe, JsonPipe } from "@angular/common";
import { Component } from "@angular/core";
import { MatButton } from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from "@angular/material/table";
import { LogEntry } from "../../shared/log/log-entry";
import { LS_LOG_NAME } from "../../shared/log/log-local-storage";
import { LogLevelPipe } from "../../shared/pipes/log-level.pipe";

@Component({
  selector: "app-log-view",
  templateUrl: "./log-view.component.html",
  styleUrl: "./log-view.component.css",
  imports: [
    MatButton,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    JsonPipe,
    DatePipe,
    LogLevelPipe,
  ],
})
export class LogViewComponent {
  logEntries: LogEntry[] = [];
  displayedColumns: string[] = ["entryDate", "level", "message", "extraInfo"];

  constructor() {
    this.localStorageLog();
  }

  clearLogs(): void {
    localStorage.removeItem(LS_LOG_NAME);
    this.logEntries = [];
  }

  private localStorageLog(): void {
    this.logEntries =
      JSON.parse(localStorage.getItem(LS_LOG_NAME) || "[]") || [];
  }
}

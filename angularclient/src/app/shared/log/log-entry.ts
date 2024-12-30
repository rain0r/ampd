import { LogLevel } from "./log-level";

export class LogEntry {
  entryDate: Date = new Date();
  message = "";
  level: LogLevel = LogLevel.Debug;
  extraInfo: unknown[] = [];
  logWithDate = true;

  buildLogString(): string {
    let ret = "";

    if (this.logWithDate) {
      ret = this.formatDate() + " - ";
    }

    ret += "Type: " + LogLevel[this.level];
    ret += " - Message: " + this.message;
    if (this.extraInfo.length) {
      ret += " - Extra Info: " + this.formatParams(this.extraInfo);
    }

    return ret;
  }

  private formatParams(params: unknown[]): string {
    let ret: string = params.join(",");

    // Is there at least one object in the array?
    if (params.some((p) => typeof p == "object")) {
      ret = "";

      // Build comma-delimited string
      for (const item of params) {
        ret += JSON.stringify(item) + ",";
      }
    }

    return ret;
  }

  private formatDate(): string {
    const d = new Date();
    const date = d.toISOString().split("T")[0];
    const time = d.toTimeString().split(" ")[0];
    return `${date} ${time}`;
  }
}

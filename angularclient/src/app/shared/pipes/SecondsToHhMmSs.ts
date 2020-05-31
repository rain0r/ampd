import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "secondsToHhMmSs" })
export class SecondsToHhMmSsPipe implements PipeTransform {
  transform(value: number): string {
    const hours = Math.floor(value / 60 / 60);
    const seconds = value % 60;
    let ret = "";
    if (hours > 0) {
      ret = `${hours} hours `;
    }
    return `${ret} minutes minutes ${
      seconds < 10 ? "0" : ""
    } ${seconds} seconds`;
  }
}

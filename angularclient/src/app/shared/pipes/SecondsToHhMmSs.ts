import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "secondsToHhMmSs" })
export class SecondsToHhMmSsPipe implements PipeTransform {
  transform(value: number): string {
    const hours = Math.floor(value / 60 / 60);
    const minutes = Math.floor(value / 60) - hours * 60;
    const seconds = value % 60;
    let ret = "";
    if (hours > 0) {
      ret = `${hours} hours `;
    }
    ret +=
      minutes + " minutes " + (seconds < 10 ? "0" : "") + seconds + " seconds";
    return ret;
  }
}

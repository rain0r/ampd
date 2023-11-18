import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "secondsToHhMmSs" })
export class SecondsToHhMmSsPipe implements PipeTransform {
  transform(d: number): string {
    return this.toDaysMinutesSeconds(d);
  }

  toDaysMinutesSeconds(totalSeconds: number): string {
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const days = Math.floor(totalSeconds / (3600 * 24));

    const secondsStr = this.makeHumanReadable(seconds, "second");
    const minutesStr = this.makeHumanReadable(minutes, "minute");
    const hoursStr = this.makeHumanReadable(hours, "hour");
    const daysStr = this.makeHumanReadable(days, "day");

    return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`.replace(
      /,\s*$/,
      "",
    );
  }

  makeHumanReadable(num: number, singular: string): string {
    return num > 0
      ? `${num}${num === 1 ? ` ${singular}, ` : ` ${singular}s, `}`
      : "";
  }
}

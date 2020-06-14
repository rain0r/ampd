import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: "secondsToHhMmSs"})
export class SecondsToHhMmSsPipe implements PipeTransform {
  transform(d: number): string {
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const hours = (h > 0) ? `${('0' + h).slice(-2)}:` : '';
    return `${hours}${('0' + m).slice(-2)}:${('0' + s).slice(-2)}`;
  }
}

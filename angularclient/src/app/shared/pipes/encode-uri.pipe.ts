import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "encodeURIComponent",
  standalone: false,
})
export class EncodeURIComponentPipe implements PipeTransform {
  transform(value: string): string {
    if (typeof value !== "string") {
      return value;
    }
    return encodeURIComponent(value);
  }
}

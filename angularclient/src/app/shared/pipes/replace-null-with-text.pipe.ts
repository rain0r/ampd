import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "replaceNullWithText",
})
export class ReplaceNullWithTextPipe implements PipeTransform {
  transform(value: string, replaceText = "—"): string {
    if (typeof value === "undefined" || value === null || value.trim() === "") {
      return replaceText;
    }

    return value;
  }
}

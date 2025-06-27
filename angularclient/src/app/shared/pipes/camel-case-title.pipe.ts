import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "camelCaseTitle" })
export class CamelCaseTitlePipe implements PipeTransform {
  transform(value: string): string {
    if (
      typeof value === "undefined" ||
      value === null ||
      String(value).trim() === ""
    ) {
      return String(value);
    }

    if (value.toLowerCase().startsWith("musicbrainz")) {
      return value.replace(/_/g, " ").replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
      });
    }

    const result = value.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  }
}

import { Pipe, PipeTransform } from "@angular/core";
import { filesize } from "filesize";

@Pipe({ name: "filesize" })
export class FileSizePipe implements PipeTransform {
  private static transformOne(value: number): string {
    return String(filesize(value));
  }

  transform(value: number): string {
    return FileSizePipe.transformOne(value);
  }
}

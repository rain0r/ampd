import { Pipe, PipeTransform } from "@angular/core";
import * as filesize_ from "filesize";

@Pipe({
  name: "filesize",
})
export class FileSizePipe implements PipeTransform {
  private static transformOne(value: number): string {
    const filesize = filesize_;
    return filesize(value);
  }

  transform(value: number): string {
    return FileSizePipe.transformOne(value);
  }
}

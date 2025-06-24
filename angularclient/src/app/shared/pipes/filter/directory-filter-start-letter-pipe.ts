import { Pipe, PipeTransform } from "@angular/core";
import { Directory } from "../../messages/incoming/directory";

@Pipe({ name: "directoryFilterStartLetterPipe" })
export class DirectoryFilterStartLetterPipe implements PipeTransform {
  transform(value: Directory[], filterBy: string): Directory[] {
    filterBy = filterBy ? filterBy.substring(0, 1).toUpperCase() : "";
    return filterBy
      ? value.filter((dir: Directory) =>
          dir.path.toUpperCase().startsWith(filterBy),
        )
      : value;
  }
}

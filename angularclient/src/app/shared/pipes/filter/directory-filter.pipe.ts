import { Pipe, PipeTransform } from "@angular/core";
import { Directory } from "../../messages/incoming/directory";

@Pipe({ name: "directoryFilter" })
export class DirectoryFilterPipe implements PipeTransform {
  transform(value: Directory[], filterBy: string): Directory[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : "";
    return filterBy
      ? value.filter(
          (dir: Directory) =>
            dir.path.toLocaleLowerCase().indexOf(filterBy) !== -1,
        )
      : value;
  }
}

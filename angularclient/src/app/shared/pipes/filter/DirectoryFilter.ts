import { Pipe, PipeTransform } from "@angular/core";
import { DirectoryImpl } from "../../messages/incoming/directory-impl";

@Pipe({ name: "directoryFilter" })
export class DirectoryFilterPipe implements PipeTransform {
  transform(value: DirectoryImpl[], filterBy: string): DirectoryImpl[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : "";
    return filterBy
      ? value.filter(
          (dir: DirectoryImpl) =>
            dir.path.toLocaleLowerCase().indexOf(filterBy) !== -1
        )
      : value;
  }
}

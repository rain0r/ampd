import { Pipe, PipeTransform } from "@angular/core";
import { Category, ShortCut } from "../../shortcuts/shortcut";

@Pipe({ name: "filterByCategory" })
export class FilterByCategoryPipe implements PipeTransform {
  transform(value: ShortCut[], filterBy: string): ShortCut[] {
    filterBy = filterBy ? filterBy : "";
    return filterBy
      ? value.filter(
          (shortcut: ShortCut) => Category[shortcut.category] === filterBy,
        )
      : value;
  }
}

import { WritableSignal } from "@angular/core";
import { FilterService } from "../service/msg.service";

export abstract class Filterable {
  filterValue: WritableSignal<string>;

  protected constructor(filterService: FilterService) {
    this.filterValue = filterService.message;
  }
}

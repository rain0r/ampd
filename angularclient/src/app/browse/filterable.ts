import { effect } from "@angular/core";
import { FilterService } from "../service/msg.service";

export abstract class Filterable {
  filterValue = "";

  protected constructor(filterService: FilterService) {
    effect(() => {
      this.filterValue = filterService.getMessage();
    });
  }
}

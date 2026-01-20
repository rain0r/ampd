import { Component, inject, Input } from "@angular/core";
import { FilterService } from "../../../service/msg.service";
import { Directory } from "../../../shared/messages/incoming/directory";
import { Filterable } from "../../filterable";

import { CoverGridEntryComponent } from "./cover-grid-entry/cover-grid-entry.component";

@Component({
  selector: "app-cover-grid",
  templateUrl: "./cover-grid.component.html",
  styleUrls: ["./cover-grid.component.scss"],
  imports: [CoverGridEntryComponent],
})
export class CoverGridComponent extends Filterable {
  @Input() directories: Directory[] = [];
  @Input() dirQp = "/";

  maxCoversDisplayed = 50;

  constructor() {
    const filterService = inject(FilterService);
    super(filterService);
  }
}

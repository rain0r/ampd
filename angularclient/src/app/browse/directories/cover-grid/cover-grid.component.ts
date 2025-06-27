import { Component, Input, inject } from "@angular/core";
import { MsgService } from "../../../service/msg.service";
import { Directory } from "../../../shared/messages/incoming/directory";
import { Filterable } from "../../filterable";
import { NgIf, NgFor } from "@angular/common";
import { CoverGridEntryComponent } from "./cover-grid-entry/cover-grid-entry.component";

@Component({
  selector: "app-cover-grid",
  templateUrl: "./cover-grid.component.html",
  styleUrls: ["./cover-grid.component.scss"],
  imports: [NgIf, NgFor, CoverGridEntryComponent],
})
export class CoverGridComponent extends Filterable {
  private messageService: MsgService;

  @Input() directories: Directory[] = [];
  @Input() dirQp = "/";

  maxCoversDisplayed = 50;

  constructor() {
    const messageService = inject(MsgService);

    super(messageService);

    this.messageService = messageService;
  }
}

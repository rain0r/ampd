import { Component, Input } from "@angular/core";
import { MsgService } from "../../../service/msg.service";
import { Directory } from "../../../shared/messages/incoming/directory";
import { Filterable } from "../../filterable";

@Component({
  selector: "app-cover-grid",
  templateUrl: "./cover-grid.component.html",
  styleUrls: ["./cover-grid.component.scss"],
})
export class CoverGridComponent extends Filterable {
  @Input() directories: Directory[] = [];
  @Input() dirQp = "/";

  maxCoversDisplayed = 50;

  constructor(private messageService: MsgService) {
    super(messageService);
  }
}

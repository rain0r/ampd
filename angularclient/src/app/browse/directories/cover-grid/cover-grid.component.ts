import { Component, Input } from "@angular/core";
import { Directory } from "../../../shared/messages/incoming/directory";
import { MessageService } from "../../../service/message.service";
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

  constructor(private messageService: MessageService) {
    super(messageService);
  }
}

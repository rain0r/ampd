import { Component, Input } from "@angular/core";
import { Directory } from "../../../shared/messages/incoming/directory";
import { Filterable } from "../../filterable";
import { MessageService } from "../../../service/message.service";

@Component({
  selector: "app-virtual-scroll-directories",
  templateUrl: "./virtual-scroll-directories.component.html",
  styleUrls: ["./virtual-scroll-directories.component.scss"],
})
export class VirtualScrollDirectoriesComponent extends Filterable {
  @Input() directories: Directory[] = [];
  @Input() filterByStartCharValue = "";

  constructor(private messageService: MessageService) {
    super(messageService);
  }
}

import { Component, Input } from "@angular/core";
import { MessageService } from "../../shared/services/message.service";
import { NotificationService } from "../../shared/services/notification.service";
import { Filterable } from "../filterable";

import { ResponsiveCoverSizeService } from "../../shared/services/responsive-cover-size.service";
import { Observable } from "rxjs";
import { Directory } from "../../shared/messages/incoming/directory";
import { MatDialog } from "@angular/material/dialog";
import { ControlPanelService } from "../../shared/services/control-panel.service";
import { QueueService } from "../../shared/services/queue.service";

@Component({
  selector: "app-directories",
  templateUrl: "./directories.component.html",
  styleUrls: ["./directories.component.scss"],
})
export class DirectoriesComponent extends Filterable {
  @Input() dirQueue: Directory[] = [];
  @Input() dirQp = "/";
  coverSizeClass: Observable<string>;
  maxCoversDisplayed = 50;

  constructor(
    private controlPanelService: ControlPanelService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private queueService: QueueService,
    private responsiveCoverSizeService: ResponsiveCoverSizeService
  ) {
    super(messageService);
    this.coverSizeClass = responsiveCoverSizeService.getCoverCssClass();
  }

  onPlayDir($event: MouseEvent, dir: string): void {
    $event.stopPropagation();
    this.onAddDir($event, dir);
    this.controlPanelService.play();
    this.notificationService.popUp(`Playing directory: "${dir}"`);
  }

  onAddDir($event: MouseEvent, dir: string): void {
    $event.stopPropagation();
    if (dir.startsWith("/")) {
      dir = dir.substr(1, dir.length);
    }
    this.queueService.addDir(dir);
    this.notificationService.popUp(`Added dir: "${dir}"`);
  }
}

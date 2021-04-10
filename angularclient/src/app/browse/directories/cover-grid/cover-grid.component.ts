import { Component, Input } from "@angular/core";
import { ControlPanelService } from "../../../shared/services/control-panel.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { QueueService } from "../../../shared/services/queue.service";
import { Observable } from "rxjs";
import { ResponsiveCoverSizeService } from "../../../shared/services/responsive-cover-size.service";
import { Directory } from "../../../shared/messages/incoming/directory";
import { MessageService } from "../../../shared/services/message.service";
import { Filterable } from "../../filterable";

@Component({
  selector: "app-cover-grid",
  templateUrl: "./cover-grid.component.html",
  styleUrls: ["./cover-grid.component.scss"],
})
export class CoverGridComponent extends Filterable {
  @Input() directories: Directory[] = [];
  @Input() dirQp = "/";

  coverSizeClass: Observable<string>;
  maxCoversDisplayed = 50;

  constructor(
    private controlPanelService: ControlPanelService,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private responsiveCoverSizeService: ResponsiveCoverSizeService,
    private queueService: QueueService
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

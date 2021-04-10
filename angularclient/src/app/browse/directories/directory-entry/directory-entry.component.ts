import { Component, Input } from "@angular/core";
import { Directory } from "../../../shared/messages/incoming/directory";
import { ControlPanelService } from "../../../shared/services/control-panel.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { QueueService } from "../../../shared/services/queue.service";

@Component({
  selector: "app-directory-entry",
  templateUrl: "./directory-entry.component.html",
  styleUrls: ["./directory-entry.component.scss"],
})
export class DirectoryEntryComponent {
  @Input() directory: Directory | null = null;

  constructor(
    private controlPanelService: ControlPanelService,
    private notificationService: NotificationService,
    private queueService: QueueService
  ) {}

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

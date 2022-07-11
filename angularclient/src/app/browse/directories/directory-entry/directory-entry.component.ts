import { Component, Input, OnInit } from "@angular/core";
import { Directory } from "../../../shared/messages/incoming/directory";
import { ControlPanelService } from "../../../service/control-panel.service";
import { NotificationService } from "../../../service/notification.service";
import { QueueService } from "../../../service/queue.service";

@Component({
  selector: "app-directory-entry",
  templateUrl: "./directory-entry.component.html",
  styleUrls: ["./directory-entry.component.scss"],
})
export class DirectoryEntryComponent implements OnInit {
  @Input() directory: Directory | null = null;
  pathLink = "";

  constructor(
    private controlPanelService: ControlPanelService,
    private notificationService: NotificationService,
    private queueService: QueueService
  ) {}

  ngOnInit(): void {
    if (this.directory) {
      this.pathLink = encodeURIComponent(this.directory.path);
    }
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
      dir = dir.substring(1, dir.length);
    }
    this.queueService.addDir(dir);
    this.notificationService.popUp(`Added dir: "${dir}"`);
  }
}

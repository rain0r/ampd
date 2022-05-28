import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Directory } from "../../../../shared/messages/incoming/directory";
import { ControlPanelService } from "../../../../shared/services/control-panel.service";
import { NotificationService } from "../../../../shared/services/notification.service";
import { QueueService } from "../../../../shared/services/queue.service";
import { ResponsiveScreenService } from "../../../../shared/services/responsive-screen.service";

@Component({
  selector: "app-cover-grid-entry",
  templateUrl: "./cover-grid-entry.component.html",
  styleUrls: ["./cover-grid-entry.component.scss"],
})
export class CoverGridEntryComponent implements OnInit {
  @Input() directory: Directory | null = null;
  coverSizeClass: Observable<string>;
  pathLink = "";

  constructor(
    private controlPanelService: ControlPanelService,
    private notificationService: NotificationService,
    private queueService: QueueService,
    private responsiveCoverSizeService: ResponsiveScreenService
  ) {
    this.coverSizeClass = this.responsiveCoverSizeService.getCoverCssClass();
  }

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

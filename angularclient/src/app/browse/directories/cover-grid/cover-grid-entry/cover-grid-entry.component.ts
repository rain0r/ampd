import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { of } from "rxjs";
import { ControlPanelService } from "../../../../service/control-panel.service";
import { NotificationService } from "../../../../service/notification.service";
import { QueueService } from "../../../../service/queue.service";
import { Directory } from "../../../../shared/messages/incoming/directory";

@Component({
  selector: "app-cover-grid-entry",
  templateUrl: "./cover-grid-entry.component.html",
  styleUrls: ["./cover-grid-entry.component.scss"],
  standalone: false,
})
export class CoverGridEntryComponent implements OnInit {
  @Input() directory: Directory | null = null;
  isDisplayCover$ = of(false);
  pathLink = "";

  constructor(
    private controlPanelService: ControlPanelService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private queueService: QueueService,
  ) {}

  ngOnInit(): void {
    if (this.directory) {
      this.pathLink = encodeURIComponent(this.directory.path);
    }
    this.updateCover();
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

  private updateCover(): void {
    if (!this.directory?.albumCoverUrl) {
      return;
    }
    this.http
      .head(this.directory.albumCoverUrl, { observe: "response" })
      .subscribe({
        error: () => {
          this.directory = null;
        },
        next: () => {
          this.isDisplayCover$ = of(true);
        },
      });
  }
}

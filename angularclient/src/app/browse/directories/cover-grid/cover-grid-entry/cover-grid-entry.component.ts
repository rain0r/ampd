import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  inject,
} from "@angular/core";
import { of } from "rxjs";
import { ControlPanelService } from "../../../../service/control-panel.service";
import { NotificationService } from "../../../../service/notification.service";
import { QueueService } from "../../../../service/queue.service";
import { Directory } from "../../../../shared/messages/incoming/directory";
import { AsyncPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-cover-grid-entry",
  templateUrl: "./cover-grid-entry.component.html",
  styleUrls: ["./cover-grid-entry.component.scss"],
  imports: [RouterLink, MatButton, AsyncPipe],
})
export class CoverGridEntryComponent implements OnInit {
  private controlPanelService = inject(ControlPanelService);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private queueService = inject(QueueService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  @Input() directory: Directory | null = null;
  isDisplayCover$ = of(false);
  pathLink = "";

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
          this.changeDetectorRef.detectChanges();
        },
      });
  }
}

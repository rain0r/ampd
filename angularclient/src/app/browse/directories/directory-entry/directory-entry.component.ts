import { delay, of } from "rxjs";
import { Component, Input, OnInit, inject } from "@angular/core";
import { ControlPanelService } from "../../../service/control-panel.service";
import { NotificationService } from "../../../service/notification.service";
import { QueueService } from "../../../service/queue.service";
import { Directory } from "../../../shared/messages/incoming/directory";

import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-directory-entry",
  templateUrl: "./directory-entry.component.html",
  styleUrls: ["./directory-entry.component.scss"],
  imports: [RouterLink, MatIcon, MatButton],
})
export class DirectoryEntryComponent implements OnInit {
  private controlPanelService = inject(ControlPanelService);
  private notificationService = inject(NotificationService);
  private queueService = inject(QueueService);

  @Input() directory: Directory | null = null;
  pathLink = "";

  ngOnInit(): void {
    if (this.directory) {
      this.pathLink = encodeURIComponent(this.directory.path);
    }
  }

  onPlayDir($event: MouseEvent, dir: string): void {
    $event.stopPropagation();
    this.onAddDir($event, dir);
    of(null)
      .pipe(delay(500))
      .subscribe(
        // Delay hitting "play" since the tracks might not yet been to the queue
        () => this.controlPanelService.play(),
      );
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

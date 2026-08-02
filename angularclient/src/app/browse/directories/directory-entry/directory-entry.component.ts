import { Component, DestroyRef, Input, OnInit, inject } from "@angular/core";
import { delay, of } from "rxjs";
import { ControlPanelService } from "../../../service/control-panel.service";
import { NotificationService } from "../../../service/notification.service";
import { QueueService } from "../../../service/queue.service";
import { Directory } from "../../../shared/messages/incoming/directory";

import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-directory-entry",
  templateUrl: "./directory-entry.component.html",
  styleUrls: ["./directory-entry.component.scss"],
  imports: [RouterLink, MatIcon, MatButton],
})
export class DirectoryEntryComponent implements OnInit {
  private controlPanelService = inject(ControlPanelService);
  private destroyRef = inject(DestroyRef);
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
    this.onAddDir($event, dir, false);
    // Delay hitting "play" since the tracks might not yet been to the queue
    of(null)
      .pipe(delay(500), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.controlPanelService.play());
    this.notificationService.popUp(`Playing directory: "${dir}"`);
  }

  onAddDir($event: MouseEvent, dir: string, withPopUp = false): void {
    $event.stopPropagation();
    if (dir.startsWith("/")) {
      dir = dir.substring(1, dir.length);
    }
    this.queueService.addDir(dir);
    if (withPopUp) {
      this.notificationService.popUp(`Added dir: "${dir}"`);
    }
  }
}

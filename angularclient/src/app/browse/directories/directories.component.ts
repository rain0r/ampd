import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "../../shared/services/message.service";
import { NotificationService } from "../../shared/services/notification.service";
import { Filterable } from "../filterable";

import { ResponsiveCoverSizeService } from "../../shared/services/responsive-cover-size.service";
import { BehaviorSubject, Observable } from "rxjs";
import { SettingsService } from "../../shared/services/settings.service";
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
  coverSizeClass: Observable<string>;
  dirQueryParam: Observable<string>;
  maxCoversDisplayed = 50;
  /**
   * The get parameter 'dir', holding the currently viewed directory.
   */
  private dirQueryParam$ = new BehaviorSubject<string>("/");

  constructor(
    private activatedRoute: ActivatedRoute,
    private controlPanelService: ControlPanelService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private queueService: QueueService,
    private responsiveCoverSizeService: ResponsiveCoverSizeService,
    private router: Router,
    private settingsService: SettingsService
  ) {
    super(messageService);
    this.dirQueryParam = this.dirQueryParam$.asObservable();
    this.coverSizeClass = responsiveCoverSizeService.getCoverCssClass();
    this.activatedRoute.queryParamMap.subscribe((params) => {
      if (params.has("dir")) {
        const dirParam = params.get("dir") || "";
        this.dirQueryParam$.next(dirParam);
      } else {
        this.dirQueryParam$.next("/");
      }
    });
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

  getAlbumCoverUrl(path: string): string {
    return `${this.settingsService.getFindDirCoverUrl()}?path=${encodeURIComponent(
      path
    )}`;
  }

  getDisplayedPath(path: string): string {
    return path.trim().split("/").pop() || "";
  }
}

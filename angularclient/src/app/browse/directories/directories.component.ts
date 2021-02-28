import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "../../shared/services/message.service";
import { NotificationService } from "../../shared/services/notification.service";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { Filterable } from "../filterable";
import { MpdCommands } from "../../shared/mpd/mpd-commands.enum";

import { ResponsiveCoverSizeService } from "../../shared/services/responsive-cover-size.service";
import { BehaviorSubject, Observable } from "rxjs";
import { SettingsService } from "../../shared/services/settings.service";
import { Directory } from "../../shared/messages/incoming/directory";

@Component({
  selector: "app-directories",
  templateUrl: "./directories.component.html",
  styleUrls: ["./directories.component.scss"],
})
export class DirectoriesComponent extends Filterable {
  @Input() dirQueue: Directory[] = [];
  coverSizeClass: Observable<string>;
  /**
   * The get parameter 'dir', holding the currently viewed directory.
   */
  dirQueryParam = new BehaviorSubject<string>("/");
  maxCoversDisplayed = 50;

  constructor(
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private responsiveCoverSizeService: ResponsiveCoverSizeService,
    private router: Router,
    private settingsService: SettingsService,
    private webSocketService: WebSocketService
  ) {
    super(messageService);
    this.coverSizeClass = responsiveCoverSizeService.getCoverCssClass();
    this.activatedRoute.queryParamMap.subscribe((params) => {
      if (params.has("dir")) {
        this.dirQueryParam.next(params.get("dir"));
      } else {
        this.dirQueryParam.next("/");
      }
    });
  }

  getDirQueryParam(): Observable<string> {
    return this.dirQueryParam.asObservable();
  }

  onPlayDir($event: MouseEvent, dir: string): void {
    $event.stopPropagation();
    this.onAddDir($event, dir);
    this.webSocketService.send(MpdCommands.SET_PLAY);
    this.notificationService.popUp(`Playing directory: "${dir}"`);
  }

  onAddDir($event: MouseEvent, dir: string): void {
    $event.stopPropagation();
    if (dir.startsWith("/")) {
      dir = dir.substr(1, dir.length);
    }
    this.webSocketService.sendData(MpdCommands.ADD_DIR, {
      dir,
    });
    this.notificationService.popUp(`Added dir: "${dir}"`);
  }

  onRowClick(dir: Directory): void {
    this.router
      .navigate(["browse"], { queryParams: { dir: dir.path } })
      .catch(() => void 0);
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

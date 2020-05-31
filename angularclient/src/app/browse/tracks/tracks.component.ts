import { Component, HostListener, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ConnectionConfigUtil } from "../../shared/connection-config/connection-config-util";
import { IMpdTrack, MpdTrack } from "../../shared/messages/incoming/mpd-track";
import { MpdCommands } from "../../shared/mpd/mpd-commands";
import { MessageService } from "../../shared/services/message.service";
import { NotificationService } from "../../shared/services/notification.service";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { Filterable } from "../filterable";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

@Component({
  selector: "app-tracks",
  templateUrl: "./tracks.component.html",
  styleUrls: ["./tracks.component.scss"],
})
export class TracksComponent extends Filterable {
  @Input() titleQueue: MpdTrack[] = [];
  getParamDir = "";
  coverSizeClass = "cover-sm";

  constructor(
    private notificationService: NotificationService,
    private webSocketService: WebSocketService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private breakpointObserver: BreakpointObserver
  ) {
    super(messageService);
    this.setCoverCssClass();
    this.getParamDir =
      this.activatedRoute.snapshot.queryParamMap.get("dir") || "/";
  }

  @HostListener("click", ["$event"])
  onPlayTitle(track: IMpdTrack): void {
    if (event) {
      event.stopPropagation();
    }
    if (track instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_PLAY_TRACK, {
      path: track.file,
    });
    this.notificationService.popUp(`Playing title: "${track.title}"`);
  }

  @HostListener("click", ["$event"])
  onAddTitle(track: IMpdTrack): void {
    if (event) {
      event.stopPropagation();
    }
    if (track instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_TRACK, {
      path: track.file,
    });
    this.notificationService.popUp(`Added title: "${track.title}"`);
  }

  coverUrl() {
    const cc = ConnectionConfigUtil.get();
    const currentCoverUrl = "find-cover";
    // Add a query param to trigger an image change in the browser
    return `${cc.backendAddr}/${currentCoverUrl}?path=${encodeURIComponent(
      this.getParamDir
    )}`;
  }

  private setCoverCssClass() {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((result) => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.coverSizeClass = "cover-xsmall";
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.coverSizeClass = "cover-small";
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.coverSizeClass = "cover-medium";
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.coverSizeClass = "cover-large";
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.coverSizeClass = "cover-xlarge";
        }
      });
  }
}

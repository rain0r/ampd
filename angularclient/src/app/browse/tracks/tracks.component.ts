import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ConnConfUtil } from "../../shared/conn-conf/conn-conf-util";
import { IMpdTrack, MpdTrack } from "../../shared/messages/incoming/mpd-track";
import { MpdCommands } from "../../shared/mpd/mpd-commands";
import { MessageService } from "../../shared/services/message.service";
import { NotificationService } from "../../shared/services/notification.service";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { Filterable } from "../filterable";
import { ResponsiveCoverSizeService } from "../../shared/cover-size/responsive-cover-size.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-tracks",
  templateUrl: "./tracks.component.html",
  styleUrls: ["./tracks.component.scss"],
})
export class TracksComponent extends Filterable {
  @Input() titleQueue: MpdTrack[] = [];
  getParamDir = "";
  coverSizeClass: Observable<string>;
  validCoverUrl = false;

  constructor(
    private notificationService: NotificationService,
    private webSocketService: WebSocketService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private responsiveCoverSizeService: ResponsiveCoverSizeService
  ) {
    super(messageService);
    this.coverSizeClass = responsiveCoverSizeService.getCoverCssClass();
    this.getParamDir =
      this.activatedRoute.snapshot.queryParamMap.get("dir") || "/";
  }

  onPlayTitle(track: IMpdTrack): void {
    if (track instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_PLAY_TRACK, {
      path: track.file,
    });
    this.notificationService.popUp(`Playing title: "${track.title}"`);
  }

  onAddTitle(track: IMpdTrack): void {
    this.webSocketService.sendData(MpdCommands.ADD_TRACK, {
      path: track.file,
    });
    this.notificationService.popUp(`Added title: "${track.title}"`);
  }

  coverUrl(): string {
    const cc = ConnConfUtil.get();
    const currentCoverUrl = "find-cover";
    // Add a query param to trigger an image change in the browser
    return `${cc.backendAddr}/${currentCoverUrl}?path=${encodeURIComponent(
      this.getParamDir
    )}`;
  }

  onError(): void {
    this.validCoverUrl = false;
  }

  onLoad(): void {
    this.validCoverUrl = true;
  }
}

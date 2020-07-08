import { Injectable } from "@angular/core";
import { IBrowseMsgPayload } from "../messages/incoming/browse";
import { DirectoryImpl } from "../messages/incoming/directory-impl";
import { BrowseInfo } from "../models/browse-info";
import { MpdCommands } from "../mpd/mpd-commands";
import { WebSocketService } from "./web-socket.service";

@Injectable()
export class BrowseService {
  browseInfo: BrowseInfo = new BrowseInfo();

  constructor(private webSocketService: WebSocketService) {
    this.buildMsgReceiver();
  }

  sendBrowseReq(path: string): void {
    if (path && !path.startsWith("/")) {
      path = "/" + path;
    }
    const fullPath = path ? path : "/";
    this.webSocketService.sendData(MpdCommands.GET_BROWSE, {
      path: fullPath,
    });
  }

  private onBrowseResponse(payload: IBrowseMsgPayload): void {
    this.browseInfo.clearAll();
    payload.directories.forEach((dir) => {
      const directory = new DirectoryImpl(true, dir.path);
      this.browseInfo.dirQueue.push(directory);
    });
    payload.tracks.forEach((track) => {
      this.browseInfo.trackQueue.push(track);
    });
    payload.playlists.forEach((playlist) => {
      this.browseInfo.playlistQueue.push(playlist);
    });
  }

  private buildMsgReceiver() {
    this.webSocketService
      .getBrowseSubscription()
      .subscribe((message: IBrowseMsgPayload) =>
        this.onBrowseResponse(message)
      );
  }
}

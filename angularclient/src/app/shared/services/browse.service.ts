import { Injectable } from "@angular/core";
import { Observable } from "rxjs/index";
import { IBrowseMsgPayload } from "../messages/incoming/browse";
import { Directory } from "../messages/incoming/directory";
import { BrowseInfo } from "../models/browse-info";
import { MpdCommands } from "../mpd/mpd-commands";
import { WebSocketService } from "./web-socket.service";

@Injectable()
export class BrowseService {
  browseInfo: BrowseInfo = new BrowseInfo();
  browseSubs: Observable<IBrowseMsgPayload>;

  constructor(private webSocketService: WebSocketService) {
    this.browseSubs = this.webSocketService.getBrowseSubscription();
    this.browseSubs.subscribe((message: IBrowseMsgPayload) =>
      this.onBrowseResponse(message)
    );
  }

  sendBrowseReq(pPath: string): void {
    if (pPath && !pPath.startsWith("/")) {
      pPath = "/" + pPath;
    }
    const path = pPath ? pPath : "/";
    this.webSocketService.sendData(MpdCommands.GET_BROWSE, {
      path,
    });
  }

  private onBrowseResponse(payload: IBrowseMsgPayload): void {
    this.browseInfo.clearAll();

    payload.directories.forEach((dir) => {
      const directory = new Directory(true, dir.path);
      this.browseInfo.dirQueue.push(directory);
    });
    payload.tracks.forEach((track) => {
      this.browseInfo.trackQueue.push(track);
    });
    payload.playlists.forEach((playlist) => {
      this.browseInfo.playlistQueue.push(playlist);
    });
  }
}

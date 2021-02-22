import { Injectable } from "@angular/core";
import { BrowseMsgPayload } from "../messages/incoming/browse";
import { Directory } from "../messages/incoming/directory";
import { BrowseInfo } from "../models/browse-info";
import { WebSocketService } from "./web-socket.service";
import { Observable, Subject } from "rxjs";
import { MpdCommands } from "../mpd/mpd-commands.enum";

@Injectable()
export class BrowseService {
  browseInfo: Observable<BrowseInfo>;
  private browseInfoSubject: Subject<BrowseInfo> = new Subject<BrowseInfo>();

  constructor(private webSocketService: WebSocketService) {
    this.browseInfo = this.browseInfoSubject.asObservable();
    this.buildMsgReceiver();
  }

  sendBrowseReq(path: string): void {
    this.clearBrowseInfo();
    if (path && !path.startsWith("/")) {
      path = "/" + path;
    }
    const fullPath = path ? path : "/";
    this.webSocketService.sendData(MpdCommands.GET_BROWSE, {
      path: fullPath,
    });
  }

  private clearBrowseInfo() {
    this.browseInfoSubject.next(new BrowseInfo());
  }

  private onBrowseResponse(payload: BrowseMsgPayload): void {
    const newBrowseInfo = new BrowseInfo();
    payload.directories.forEach((dir) => {
      const directory: Directory = {
        directory: true,
        path: dir.path,
      } as Directory;
      newBrowseInfo.dirQueue.push(directory);
    });
    payload.tracks.forEach((track, index) => {
      track.position = index;
      newBrowseInfo.trackQueue.push(track);
    });
    payload.playlists.forEach((playlist) => {
      newBrowseInfo.playlistQueue.push(playlist);
    });
    this.browseInfoSubject.next(newBrowseInfo);
  }

  private buildMsgReceiver() {
    this.webSocketService
      .getBrowseSubscription()
      .subscribe((message: BrowseMsgPayload) => this.onBrowseResponse(message));
  }
}

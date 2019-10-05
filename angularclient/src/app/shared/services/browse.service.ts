import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';
import { BrowseRootImpl, IBrowseMsgPayload } from '../messages/incoming/browse';
import { Directory } from '../messages/incoming/directory';
import { BrowseInfo } from '../models/browse-info';
import { MpdCommands } from '../mpd/mpd-commands';
import { WebSocketService } from './web-socket.service';

@Injectable()
export class BrowseService {
  public browseInfo: BrowseInfo = new BrowseInfo();
  public getParamDir = '';
  public browseSubs: Observable<BrowseRootImpl>;
  public containerWidth = 50;

  constructor(private webSocketService: WebSocketService) {
    this.browseSubs = this.webSocketService.getBrowseSubs();
    this.buildMessageReceiver();
  }

  public sendBrowseReq(pPath: string): void {
    if (pPath && !pPath.startsWith('/')) {
      pPath = '/' + pPath;
    }
    const path = pPath ? pPath : '/';
    this.webSocketService.sendData(MpdCommands.GET_BROWSE, {
      path,
    });
  }

  private buildMessageReceiver(): void {
    console.log('buildMessageReceiver()');
    this.browseSubs.subscribe((message: BrowseRootImpl) => {
      try {
        this.onBrowseResponse(message.payload);
      } catch (error) {
        console.error(`Error handling message:`);
        console.error(message);
      }
    });
  }

  private onBrowseResponse(payload: IBrowseMsgPayload): void {
    this.browseInfo.clearAll();

    payload.directories.forEach(dir => {
      const directory = new Directory(true, dir.path, dir.albumCover);
      this.browseInfo.dirQueue.push(directory);
    });
    payload.tracks.forEach(track => {
      this.browseInfo.trackQueue.push(track);
    });
    payload.playlists.forEach(playlist => {
      this.browseInfo.playlistQueue.push(playlist);
    });

    this.calculateContainerWidth();
  }

  private calculateContainerWidth() {
    let tmpCount = 0;
    if (this.browseInfo.dirQueue.length > 0) {
      tmpCount += 1;
    }
    if (this.browseInfo.trackQueue.length > 0) {
      tmpCount += 1;
    }
    if (this.browseInfo.playlistQueue.length > 0) {
      tmpCount += 1;
    }

    tmpCount = tmpCount > 0 ? tmpCount : 1;
    this.containerWidth = 100 / tmpCount;
  }
}

import { Injectable } from '@angular/core';
import { MpdCommands } from '../mpd/mpd-commands';
import { WebSocketService } from './web-socket.service';

@Injectable()
export class BrowseService {
  constructor(private webSocketService: WebSocketService) {}

  public browse(pPath: string): void {
    if (pPath && !pPath.startsWith('/')) {
      pPath = '/' + pPath;
    }
    const path = pPath ? pPath : '/';
    this.webSocketService.sendData(MpdCommands.GET_BROWSE, {
      path,
    });
    // this.breadcrumb = this.buildBreadcrumb(path);
  }
}

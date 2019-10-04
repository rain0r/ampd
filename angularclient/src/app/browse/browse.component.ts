import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StompService, StompState } from '@stomp/ng2-stompjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { AppComponent } from '../app.component';
import { ConnectionConfiguration } from '../connection-configuration';
import { AmpdBlockUiService } from '../shared/block/ampd-block-ui.service';
import { BrowseRootImpl } from '../shared/messages/incoming/browse';
import { Directory } from '../shared/messages/incoming/directory';
import { IMpdSong, MpdSong } from '../shared/messages/incoming/mpd-song';
import { Playlist } from '../shared/messages/incoming/playlist';
import { MpdCommands } from '../shared/mpd/mpd-commands';
import { NotificationService } from '../shared/services/notification.service';
import { WebSocketService } from '../shared/services/web-socket.service';

export interface IBreadcrumbItem {
  text: string;
  link: string;
}

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent {
  public dirQueue: Directory[] = [];
  public playlistQueue: Playlist[] = [];
  public titleQueue: MpdSong[] = [];
  public breadcrumb: IBreadcrumbItem[] = [];
  public getParamDir = '';
  public browseSubs: Observable<BrowseRootImpl>;
  public containerWidth = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private appComponent: AppComponent,
    private router: Router,
    private stompService: StompService,
    private ampdBlockUiService: AmpdBlockUiService,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService
  ) {
    this.browseSubs = this.webSocketService.getBrowseSubs();
    // this.buildConnectionState();
    this.buildMessageReceiver();
  }

  public onClearQueue(): void {
    this.webSocketService.send(MpdCommands.RM_ALL);
  }

  public updateUrl($event) {
    const cc = ConnectionConfiguration.get();
    const url = `${cc.coverServer}/baseline_folder_open_black_18dp.png`;
    $event.target.src = url;
  }

  // private buildConnectionState(): void {
  //   this.stompService.state
  //     .pipe(map((state: number) => StompState[state]))
  //     .subscribe((status: string) => {
  //       if (status === 'CONNECTED') {
  //         this.appComponent.setConnected();
  //         this.ampdBlockUiService.stop();
  //
  //         this.activatedRoute.queryParams.subscribe(params => {
  //           let dir = '/';
  //           if ('dir' in params) {
  //             dir = params.dir;
  //           }
  //           this.getParamDir = dir;
  //           this.browse(dir);
  //         });
  //       } else {
  //         this.appComponent.setDisconnected();
  //       }
  //     });
  // }

  private onBrowseResponse(payload): void {
    this.ampdBlockUiService.stop();

    this.dirQueue = [];
    this.playlistQueue = [];
    this.titleQueue = [];

    payload.directories.forEach(item => {
      const directory = new Directory(true, item.path, item.albumCover);
      this.dirQueue.push(directory);
    });
    payload.songs.forEach(item => {
      this.titleQueue.push(item);
    });
    payload.playlists.forEach(item => {
      this.playlistQueue.push(item);
    });

    this.calculateContainerWidth();
  }

  private calculateContainerWidth() {
    let tmpCount = 0;
    if (this.dirQueue.length > 0) {
      tmpCount += 1;
    }
    if (this.titleQueue.length > 0) {
      tmpCount += 1;
    }
    if (this.playlistQueue.length > 0) {
      tmpCount += 1;
    }

    tmpCount = tmpCount > 0 ? tmpCount : 1;

    this.containerWidth = 100 / tmpCount;
    console.log(this.titleQueue);
  }

  private buildMessageReceiver(): void {
    this.browseSubs.subscribe((message: BrowseRootImpl) => {
      try {
        this.onBrowseResponse(message.payload);
      } catch (error) {
        console.error(`Error handling message:`);
        console.error(message);
      }
    });
  }

  // private browse(pPath: string): void {
  //   if (pPath && !pPath.startsWith('/')) {
  //     pPath = '/' + pPath;
  //   }
  //   const path = pPath ? pPath : '/';
  //   this.webSocketService.sendData(MpdCommands.GET_BROWSE, {
  //     path,
  //   });
  //   this.breadcrumb = this.buildBreadcrumb(path);
  // }

  // private buildBreadcrumb(path: string): IBreadcrumbItem[] {
  //   const ret: IBreadcrumbItem[] = [];
  //
  //   ret.push({
  //     text: 'root',
  //     link: '/',
  //   });
  //
  //   const splitted = path.split('/');
  //   for (let index = 0; index < splitted.length; index++) {
  //     const elem = splitted[index];
  //
  //     if (elem.trim().length > 0) {
  //       let link = '';
  //       if (index > 0) {
  //         const prevIndex = index - 1;
  //         link = splitted[prevIndex] + '/';
  //       }
  //
  //       ret.push({
  //         text: elem,
  //         link: link + elem,
  //       });
  //     }
  //   }
  //
  //   return ret;
  // }
}

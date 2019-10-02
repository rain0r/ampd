import { Component, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { StompService, StompState } from '@stomp/ng2-stompjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { AppComponent } from '../app.component';
import { MpdCommands } from '../shared/mpd/mpd-commands';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Directory, Playlist } from 'BrowseMsg';
import { IMpdSong } from 'QueueMsg';
import { ConnectionConfiguration } from '../connection-configuration';
import { AmpdBlockUiService } from '../shared/block/ampd-block-ui.service';
import {
  BrowseRootImpl,
  DirectoryImpl,
} from '../shared/messages/incoming/browse-impl';
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
  public titleQueue: IMpdSong[] = [];
  public breadcrumb: IBreadcrumbItem[] = [];
  public getParamDir = '';
  public browseSubs: Observable<BrowseRootImpl>;
  public containerWidth = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private appComponent: AppComponent,
    private router: Router,
    private snackBar: MatSnackBar,
    private stompService: StompService,
    private ampdBlockUiService: AmpdBlockUiService,
    private webSocketService: WebSocketService,
  ) {

    this.ampdBlockUiService.start();
    this.browseSubs = this.webSocketService.getBrowseSubs();
    this.buildConnectionState();
    this.buildMessageReceiver();
  }

  @HostListener('click', ['$event'])
  public onDirClick(directory: string): void {
    if (event) {
      event.stopPropagation();
    }
    const splittedPath: string = this.splitDir(directory);
    let targetDir: string = this.getParamDir
      ? this.getParamDir + '/' + splittedPath
      : splittedPath;
    targetDir = targetDir.replace(/\/+(?=\/)/g, '');
    this.router.navigate(['browse'], { queryParams: { dir: targetDir } });
  }

  public onClickPlaylist(event: Playlist): void {
    this.webSocketService.sendData(MpdCommands.ADD_PLAYLIST, {
      playlist: event.name,
    });
    this.popUp(`Added playlist: "${event.name}"`);
  }

  @HostListener('click', ['$event'])
  public onAddDir(dir: string): void {
    if (event) {
      event.stopPropagation();
    }
    if (typeof dir !== 'string') {
      return;
    }
    if (dir.startsWith('/')) {
      dir = dir.substr(1, dir.length);
    }
    this.webSocketService.sendData(MpdCommands.ADD_DIR, {
      dir,
    });
    this.popUp(`Added dir: "${dir}"`);
  }

  @HostListener('click', ['$event'])
  public onPlayDir(dir: string): void {
    if (typeof dir !== 'string') {
      return;
    }
    this.onAddDir(dir);
    this.webSocketService.send(MpdCommands.SET_PLAY);
    this.popUp(`Playing dir: "${dir}"`);
  }

  @HostListener('click', ['$event'])
  public onPlayTitle(song: IMpdSong): void {
    if (event) {
      event.stopPropagation();
    }
    if (song instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_PLAY_TRACK, {
      path: song.file,
    });
    this.popUp(`Playing title: "${song.title}"`);
  }

  @HostListener('click', ['$event'])
  public onAddTitle(song: IMpdSong): void {
    if (event) {
      event.stopPropagation();
    }
    if (song instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_TRACK, {
      path: song.file,
    });
    this.popUp(`Added title: "${song.title}"`);
  }

  /**
   * Returns the last element of a path.
   * @param {string} dir
   * @returns {string}
   */
  public splitDir(dir: string): string {
    const splitted: string =
      dir
        .trim()
        .split('/')
        .pop() || '';
    return splitted;
  }

  public moveDirUp(): void {
    const splitted = this.getParamDir.split('/');
    splitted.pop();
    let targetDir = splitted.join('/');
    if (targetDir.length === 0) {
      targetDir = '/';
    }
    this.router.navigate(['browse'], { queryParams: { dir: targetDir } });
  }

  public onClearQueue(): void {
    this.webSocketService.send(MpdCommands.RM_ALL);
  }

  public updateUrl($event) {
    const cc = ConnectionConfiguration.get();
    const url = `${cc.coverServer}/baseline_folder_open_black_18dp.png`;
    $event.target.src = url;
  }

  private buildConnectionState(): void {
    this.stompService.state
      .pipe(map((state: number) => StompState[state]))
      .subscribe((status: string) => {
        if (status === 'CONNECTED') {
          this.appComponent.setConnected();
          this.ampdBlockUiService.stop();

          this.activatedRoute.queryParams.subscribe(params => {
            let dir = '/';
            if ('dir' in params) {
              dir = params.dir;
            }
            this.getParamDir = dir;
            this.browse(dir);
          });
        } else {
          this.appComponent.setDisconnected();
        }
      });
  }

  private browse(pPath: string): void {
    if (pPath && !pPath.startsWith('/')) {
      pPath = '/' + pPath;
    }
    const path = pPath ? pPath : '/';
    this.webSocketService.sendData(MpdCommands.GET_BROWSE, {
      path,
    });
    this.breadcrumb = this.buildBreadcrumb(path);
  }

  private buildBreadcrumb(path: string): IBreadcrumbItem[] {
    const ret: IBreadcrumbItem[] = [];

    ret.push({
        text: 'root',
        link : '/',
    });

    const splitted = path.split('/');
    for (let index = 0; index < splitted.length; index++) {
      const elem = splitted[index];

      if (elem.trim().length > 0) {
        let link = '';
        if (index > 0) {
          const prevIndex = index - 1;
          link = splitted[prevIndex] + '/';
        }

        ret.push({
          text: elem,
          link: link + elem,
        });
      }
    }

    return ret;
  }

  private popUp(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
    });
  }

  private onBrowseResponse(payload): void {
    this.ampdBlockUiService.stop();

    this.dirQueue = [];
    this.playlistQueue = [];
    this.titleQueue = [];

    payload.directories.forEach(item => {
      const directory = new DirectoryImpl(true, item.path, item.albumCover);
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
    if (this.dirQueue.length> 0) {
      tmpCount+=1;
    }
    if (this.titleQueue.length> 0) {
      tmpCount+=1;
    }
    if (this.playlistQueue.length> 0) {
      tmpCount+=1;
    }

    tmpCount=(tmpCount > 0) ? tmpCount : 1;

    this.containerWidth = 100 / tmpCount;
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
}

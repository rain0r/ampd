import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppComponent } from '../app.component';
import { MpdCommands } from '../shared/mpd/mpd-commands';
import { StompService, StompState } from '@stomp/ng2-stompjs';
import { map } from 'rxjs/internal/operators';
import { MpdTypes } from '../shared/mpd/mpd-types';
import { Message } from '@stomp/stompjs';
import { Observable } from 'rxjs';
import { Directory, Playlist } from '../shared/models/browse-elements';
import { MpdSong } from '../shared/mpd/mpd-messages';
import { WebSocketService } from '../shared/services/web-socket.service';
import { AmpdBlockUiService } from '../shared/block/ampd-block-ui.service';

export interface BreadcrumbItem {
  text: string;
  link: string;
}

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent {
  dirQueue: Directory[] = [];
  playlistQueue: Playlist[] = [];
  titleQueue: MpdSong[] = [];
  breadcrumb: BreadcrumbItem[] = [];
  getParamDir = '';
  stompSubscription: Observable<Message>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private appComponent: AppComponent,
    private router: Router,
    private snackBar: MatSnackBar,
    private stompService: StompService,
    private ampdBlockUiService: AmpdBlockUiService,
    private webSocketService: WebSocketService
  ) {
    this.ampdBlockUiService.start();
    this.stompSubscription = this.webSocketService.getStompSubscription();
    this.buildConnectionState();
    this.buildMessageReceiver();
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
              dir = params['dir'];
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

  private buildBreadcrumb(path: string): BreadcrumbItem[] {
    const ret: BreadcrumbItem[] = [];
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

  @HostListener('click', ['$event'])
  onDirClick(directory: string): void {
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

  onClickPlaylist(event: Playlist): void {
    this.webSocketService.sendData(MpdCommands.ADD_PLAYLIST, {
      playlist: event.name,
    });
    this.popUp(`Added playlist: "${event.name}"`);
  }

  @HostListener('click', ['$event'])
  onAddDir(dir: string): void {
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
  onPlayDir(dir: string): void {
    if (typeof dir !== 'string') {
      return;
    }
    this.onAddDir(dir);
    this.webSocketService.send(MpdCommands.SET_PLAY);
    this.popUp(`Playing dir: "${dir}"`);
  }

  @HostListener('click', ['$event'])
  onPlayTitle(song: MpdSong): void {
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
  onAddTitle(song: MpdSong): void {
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

  splitDir(dir: string): string {
    const splitted: string =
      dir
        .trim()
        .split('/')
        .pop() || '';
    return splitted;
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
      const directory = new Directory();
      directory.path = item.path;
      directory.splittedDir = this.splitDir(item.path);
      this.dirQueue.push(directory);
    });
    payload.songs.forEach(item => {
      this.titleQueue.push(item);
    });
    payload.playlists.forEach(item => {
      this.playlistQueue.push(item);
    });
  }

  private buildMessageReceiver(): void {
    this.stompSubscription.subscribe((message: any) => {
      if (message && 'type' in message) {
        switch (message.type) {
          case MpdTypes.BROWSE:
            this.onBrowseResponse(message.payload);
            break;
        }
      }
    });
  }

  moveDirUp(): void {
    // this.ampdBlockUiService.start();
    const splitted = this.getParamDir.split('/');
    splitted.pop();
    let targetDir = splitted.join('/');
    if (targetDir.length === 0) {
      targetDir = '/';
    }
    this.router.navigate(['browse'], { queryParams: { dir: targetDir } });
  }

  onClearQueue(): void {
    this.webSocketService.send(MpdCommands.RM_ALL);
  }
}

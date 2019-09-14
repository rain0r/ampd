import { Component, HostListener } from '@angular/core';

import { AppComponent } from '../app.component';
import { QueueSong } from '../shared/models/queue-song';
import { MpdTypes } from '../shared/mpd/mpd-types';
import { MatDialog, MatSliderChange } from '@angular/material';
import { StompService, StompState } from '@stomp/ng2-stompjs';
import { map } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';
import { MpdCommands } from '../shared/mpd/mpd-commands';
import { WebSocketService } from '../shared/services/web-socket.service';
import { CoverModalComponent } from '../shared/cover-modal/cover-modal.component';
import { AmpdBlockUiService } from '../shared/block/ampd-block-ui.service';
import { ControlPanel, ServerStatus } from 'StateMessage';
import { MpdSong, State } from '../shared/mpd/mpd-messages';
import {
  ControlPanelImpl,
  RootObjectImpl,
} from '../shared/mpd/state-messages-impl';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css'],
})
export class QueueComponent {
  controlPanel: ControlPanel = new ControlPanelImpl();
  queue: QueueSong[] = [];

  currentSong: QueueSong = new QueueSong();
  currentState: string = '';
  displayedColumns = [
    { name: 'pos', showMobile: false },
    { name: 'artist', showMobile: true },
    { name: 'album', showMobile: false },
    { name: 'title', showMobile: true },
    { name: 'length', showMobile: false },
    { name: 'remove', showMobile: true },
  ];
  volume: number = 0;
  stompSubscription: Observable<RootObjectImpl>;

  constructor(
    private appComponent: AppComponent,
    private stompService: StompService,
    private webSocketService: WebSocketService,
    private ampdBlockUiService: AmpdBlockUiService,
    public dialog: MatDialog
  ) {
    this.ampdBlockUiService.start();
    this.stompSubscription = this.webSocketService.getStompSubscription();
    this.buildConnectionState();
    this.buildMessageReceiver();
    this.sendGetQueue();
  }

  private sendGetQueue(): void {
    this.webSocketService.send(MpdCommands.GET_QUEUE);
  }

  private buildState(pMessage: State): void {
    let callBuildQueue = false;
    this.ampdBlockUiService.stop();

    /* Call buildQueue once if there is no current song set */
    if ('id' in this.currentSong === false) {
      callBuildQueue = true;
    }

    const serverStatus: ServerStatus = pMessage.serverStatus;
    this.currentSong = new QueueSong(pMessage.currentSong);
    this.controlPanel = pMessage.controlPanel;

    sessionStorage.setItem('currentSong', JSON.stringify(this.currentSong));
    this.currentSong.elapsedFormatted = this.getFormattedElapsedTime(
      serverStatus.elapsedTime
    );
    this.currentSong.progress = serverStatus.elapsedTime;
    this.currentState = serverStatus.state;
    this.volume = serverStatus.volume;

    this.queue.forEach(song => {
      if (this.currentSong.id === song.id) {
        song.playing = true;
      } else {
        song.playing = false;
      }
    });

    if (callBuildQueue === true) {
      this.sendGetQueue();
    }
  }

  private buildQueue(message: MpdSong[]): void {
    this.queue = [];
    let posCounter = 1;

    for (const item of message) {
      const song: QueueSong = new QueueSong(item);
      song.pos = posCounter;

      if (this.currentSong.id === item.id) {
        song.playing = true;
      }

      this.queue.push(song);
      posCounter += 1;
    }
  }

  handleCurrentSongProgressSlider(event: MatSliderChange): void {
    this.webSocketService.sendData(MpdCommands.SET_SEEK, {
      value: event.value,
    });
  }

  handleVolumeSlider(event: MatSliderChange): void {
    this.webSocketService.sendData(MpdCommands.SET_VOLUME, {
      value: event.value,
    });
  }

  handleControlButton(event: MouseEvent): void {
    let command: string = '';
    const element = event.currentTarget as HTMLInputElement;
    switch (element.id) {
      case 'btn-prev':
        command = MpdCommands.SET_PREV;
        break;
      case 'btn-stop':
        command = MpdCommands.SET_STOP;
        break;
      case 'btn-pause':
        command = MpdCommands.SET_PAUSE;
        break;
      case 'btn-play':
        command = MpdCommands.SET_PLAY;
        break;
      case 'btn-next':
        command = MpdCommands.SET_NEXT;
        break;
    }
    if (command) {
      this.webSocketService.send(command);
    }
  }

  /**
   * Play the song from the queue which has been clicked.
   *
   * @param {string} pFile
   */
  onRowClick(pFile: string): void {
    this.webSocketService.sendData(MpdCommands.PLAY_TRACK, { path: pFile });
  }

  @HostListener('document:visibilitychange', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    if (document.visibilityState === 'visible') {
      this.sendGetQueue();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!event || !event.srcElement) {
      return;
    }

    if (event.srcElement.tagName === 'MAT-SLIDER') {
      /* We want to change the volume (with the keyboard) - not skip the song. */
      return;
    }

    if (event.srcElement.tagName === 'INPUT') {
      /* We want to search for something - not skip the song. */
      return;
    }

    let command: string = '';

    switch (event.which) {
      case 37: // left
        command = MpdCommands.SET_PREV;
        break;
      case 39: // right
        command = MpdCommands.SET_NEXT;
        break;
      case 32: // space
        if (this.currentState === 'pause') {
          command = MpdCommands.SET_PLAY;
        } else if (this.currentState === 'play') {
          command = MpdCommands.SET_PAUSE;
        }
        break;
    }
    if (command) {
      this.webSocketService.send(command);
      event.preventDefault();
    }
  }

  onClearQueue(): void {
    this.queue = [];
    this.webSocketService.send(MpdCommands.RM_ALL);
  }

  onRemoveTrack(position: number): void {
    this.webSocketService.sendData(MpdCommands.RM_TRACK, {
      position,
    });
    this.sendGetQueue();
  }

  private buildConnectionState(): void {
    this.stompService.state
      .pipe(map((state: number) => StompState[state]))
      .subscribe((status: string) => {
        if (status === 'CONNECTED') {
          this.appComponent.setConnected();
          this.sendGetQueue();
        } else {
          this.appComponent.setDisconnected();
        }
      });
  }

  private buildMessageReceiver(): void {
    this.stompSubscription.subscribe((message: any) => {
      if (message && 'type' in message) {
        switch (message.type) {
          case MpdTypes.STATE:
            this.buildState(message.payload);
            break;
          case MpdTypes.QUEUE:
            this.buildQueue(message.payload);
            break;
        }
      }
    });
  }

  toggleCtrl(event): void {
    for (const key in this.controlPanel) {
      if (event.value.includes(key)) {
        this.controlPanel[key] = true;
      } else {
        this.controlPanel[key] = false;
      }
    }
    this.webSocketService.sendData(MpdCommands.TOGGLE_CONTROL, {
      controlPanel: this.controlPanel,
    });
  }

  getFormattedElapsedTime(elapsedTime: number): string {
    if (isNaN(this.currentSong.length)) {
      return '';
    }
    const elapsedMinutes = Math.floor(elapsedTime / 60);
    const elapsedSeconds = elapsedTime - elapsedMinutes * 60;
    return (
      elapsedMinutes + ':' + (elapsedSeconds < 10 ? '0' : '') + elapsedSeconds
    );
  }

  openCoverModal(): void {
    const dialogRef = this.dialog.open(CoverModalComponent, {
      data: { coverUrl: this.currentSong.coverUrl() },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  getDisplayedColumns(): string[] {
    const isMobile = this.appComponent.isMobile();
    return this.displayedColumns
      .filter(cd => !isMobile || cd.showMobile)
      .map(cd => cd.name);
  }
}

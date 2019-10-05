import { Component, HostListener } from '@angular/core';

import { MatDialog, MatSliderChange } from '@angular/material';
import { StompService } from '@stomp/ng2-stompjs';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { AmpdBlockUiService } from '../shared/block/ampd-block-ui.service';
import { CoverModalComponent } from '../shared/cover-modal/cover-modal.component';
import {
  ControlPanelImpl,
  IControlPanel,
} from '../shared/messages/incoming/control-panel';
import { IMpdTrack } from '../shared/messages/incoming/mpd-track';
import { QueueRootImpl } from '../shared/messages/incoming/queue';
import { ServerStatusRootImpl } from '../shared/messages/incoming/state-messages';
import { StateMsgPayload } from '../shared/messages/incoming/state-msg-payload';
import { QueueSong } from '../shared/models/queue-song';
import { MpdCommands } from '../shared/mpd/mpd-commands';
import { WebSocketService } from '../shared/services/web-socket.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css'],
})
export class QueueComponent {
  public controlPanel: IControlPanel = new ControlPanelImpl();
  public queue: QueueSong[] = [];

  public currentSong: QueueSong = new QueueSong();
  public currentState: string = '';
  public displayedColumns = [
    { name: 'pos', showMobile: false },
    { name: 'artist', showMobile: true },
    { name: 'album', showMobile: false },
    { name: 'title', showMobile: true },
    { name: 'length', showMobile: false },
    { name: 'remove', showMobile: true },
  ];
  public volume: number = 0;

  // Websocket subscriptions
  public stateSubs: Observable<ServerStatusRootImpl>;
  public queueSubs: Observable<QueueRootImpl>;

  constructor(
    private appComponent: AppComponent,
    private stompService: StompService,
    private webSocketService: WebSocketService,
    private ampdBlockUiService: AmpdBlockUiService,
    public dialog: MatDialog
  ) {
    this.ampdBlockUiService.start();

    this.stateSubs = this.webSocketService.getStateSubs();
    this.queueSubs = this.webSocketService.getQueueSubs();

    this.buildQueueMsgReceiver();
    this.buildStateReceiver();

    this.sendGetQueue();
  }

  public handleCurrentSongProgressSlider(event: MatSliderChange): void {
    this.webSocketService.sendData(MpdCommands.SET_SEEK, {
      value: event.value,
    });
  }

  public handleVolumeSlider(event: MatSliderChange): void {
    this.webSocketService.sendData(MpdCommands.SET_VOLUME, {
      value: event.value,
    });
  }

  public handleControlButton(event: MouseEvent): void {
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
      default:
      // Ignore it
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
  public onRowClick(pFile: string): void {
    this.webSocketService.sendData(MpdCommands.PLAY_TRACK, { path: pFile });
  }

  @HostListener('document:visibilitychange', ['$event'])
  public onKeyUp(ev: KeyboardEvent) {
    if (document.visibilityState === 'visible') {
      this.sendGetQueue();
    }
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyDown(event: KeyboardEvent) {
    if (!event || !event.srcElement) {
      return;
    }

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.tagName === 'MAT-SLIDER') {
      /* We want to change the volume (with the keyboard) - not skip the song. */
      return;
    }

    if (inputElement.tagName === 'INPUT') {
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
      default:
      // Ignore it
    }
    if (command) {
      this.webSocketService.send(command);
      event.preventDefault();
    }
  }

  public onClearQueue(): void {
    this.queue = [];
    this.webSocketService.send(MpdCommands.RM_ALL);
  }

  public onRemoveTrack(position: number): void {
    this.webSocketService.sendData(MpdCommands.RM_TRACK, {
      position,
    });
    this.sendGetQueue();
  }

  public toggleCtrl(event): void {
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

  public getFormattedElapsedTime(elapsedTime: number): string {
    if (isNaN(this.currentSong.length)) {
      return '';
    }
    const elapsedMinutes = Math.floor(elapsedTime / 60);
    const elapsedSeconds = elapsedTime - elapsedMinutes * 60;
    return (
      elapsedMinutes + ':' + (elapsedSeconds < 10 ? '0' : '') + elapsedSeconds
    );
  }

  public openCoverModal(): void {
    const dialogRef = this.dialog.open(CoverModalComponent, {
      data: { coverUrl: this.currentSong.coverUrl() },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  public getDisplayedColumns(): string[] {
    const isMobile = this.appComponent.isMobile();
    return this.displayedColumns
      .filter(cd => !isMobile || cd.showMobile)
      .map(cd => cd.name);
  }

  private sendGetQueue(): void {
    this.webSocketService.send(MpdCommands.GET_QUEUE);
  }

  private buildState(pMessage: StateMsgPayload): void {
    let callBuildQueue = false;
    this.ampdBlockUiService.stop();

    /* Call buildQueue once if there is no current song set */
    if ('id' in this.currentSong === false) {
      callBuildQueue = true;
    }

    const serverStatus = pMessage.serverStatus;
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
      song.playing = this.currentSong.id === song.id;
    });

    if (callBuildQueue === true) {
      this.sendGetQueue();
    }
  }

  private buildQueue(message: IMpdTrack[]): void {
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

  private buildQueueMsgReceiver() {
    this.queueSubs.subscribe((message: QueueRootImpl) => {
      try {
        this.buildQueue(message.payload);
      } catch (error) {
        console.error(`Error handling message:`);
        console.error(message);
      }
    });
  }

  private buildStateReceiver() {
    this.stateSubs.subscribe((message: ServerStatusRootImpl) => {
      try {
        this.buildState(message.payload);
      } catch (error) {
        console.error(`Error handling message:`);
        console.error(message);
      }
    });
  }
}

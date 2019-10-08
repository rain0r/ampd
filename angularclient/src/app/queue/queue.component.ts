import {Component, HostListener, Input, OnInit} from '@angular/core';

import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { AmpdBlockUiService } from '../shared/block/ampd-block-ui.service';
import {
  ControlPanelImpl,
  IControlPanel,
} from '../shared/messages/incoming/control-panel';
import { ServerStatusRootImpl } from '../shared/messages/incoming/state-messages';
import { StateMsgPayload } from '../shared/messages/incoming/state-msg-payload';
import { QueueTrack } from '../shared/models/queue-track';
import { MpdCommands } from '../shared/mpd/mpd-commands';
import { WebSocketService } from '../shared/services/web-socket.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css'],
})
export class QueueComponent implements OnInit {
  private controlPanel: IControlPanel = new ControlPanelImpl();
  private currentSong: QueueTrack = new QueueTrack();
  private currentState: string = '';
  private volume: number = 0;
  private stateSubs: Observable<ServerStatusRootImpl>;

  constructor(
    private webSocketService: WebSocketService,
    private ampdBlockUiService: AmpdBlockUiService,
    public dialog: MatDialog
  ) {
    this.ampdBlockUiService.start();

    this.stateSubs = this.webSocketService.getStateSubs();
    this.buildStateReceiver();
    this.webSocketService.send(MpdCommands.GET_QUEUE);
  }

  @HostListener('document:visibilitychange', ['$event'])
  public onKeyUp(ev: KeyboardEvent) {
    if (document.visibilityState === 'visible') {
      this.webSocketService.send(MpdCommands.GET_QUEUE);
    }
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyDown(event: KeyboardEvent) {
    if (!event || !event.srcElement) {
      return;
    }

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.tagName === 'MAT-SLIDER') {
      /* We want to change the volume (with the keyboard) - not skip the track. */
      return;
    }

    if (inputElement.tagName === 'INPUT') {
      /* We want to search for something - not skip the track. */
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

  public ngOnInit() {
    this.webSocketService.send(MpdCommands.GET_QUEUE);
  }

  private buildState(pMessage: StateMsgPayload): void {
    let callBuildQueue = false;
    this.ampdBlockUiService.stop();

    /* Call buildQueue once if there is no current track set */
    if ('id' in this.currentSong === false) {
      callBuildQueue = true;
    }

    const serverStatus = pMessage.serverStatus;
    this.currentSong = new QueueTrack(pMessage.currentSong);
    this.controlPanel = pMessage.controlPanel;

    sessionStorage.setItem('currentSong', JSON.stringify(this.currentSong));
    this.currentSong.elapsedFormatted = this.getFormattedElapsedTime(
      serverStatus.elapsedTime
    );
    this.currentSong.progress = serverStatus.elapsedTime;
    this.currentState = serverStatus.state;
    this.volume = serverStatus.volume;

    if (callBuildQueue) {
      this.webSocketService.send(MpdCommands.GET_QUEUE);
    }
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

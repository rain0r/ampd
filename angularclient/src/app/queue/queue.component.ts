import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AmpdBlockUiService } from '../shared/block/ampd-block-ui.service';
import { InternalCommands } from '../shared/commands/internal';
import {
  ControlPanelImpl,
  IControlPanel,
} from '../shared/messages/incoming/control-panel';
import { ServerStatusRootImpl } from '../shared/messages/incoming/state-messages';
import { StateMsgPayload } from '../shared/messages/incoming/state-msg-payload';
import { QueueTrack } from '../shared/models/queue-track';
import { MpdCommands } from '../shared/mpd/mpd-commands';
import { MessageService } from '../shared/services/message.service';
import { WebSocketService } from '../shared/services/web-socket.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css'],
})
export class QueueComponent implements OnInit {
  private controlPanel: IControlPanel = new ControlPanelImpl();
  private currentSong: QueueTrack = new QueueTrack();
  private volume: number = 0;
  private stateSubs: Observable<ServerStatusRootImpl>;
  private currentState: string = '';

  constructor(
    private webSocketService: WebSocketService,
    private ampdBlockUiService: AmpdBlockUiService,
    private service: MessageService
  ) {
    this.ampdBlockUiService.start();

    this.stateSubs = this.webSocketService.getStateSubscription();
    this.buildStateReceiver();
    this.webSocketService.send(MpdCommands.GET_QUEUE);
  }

  @HostListener('document:visibilitychange', ['$event'])
  public onKeyUp(ev: KeyboardEvent) {
    if (document.visibilityState === 'visible') {
      this.webSocketService.send(MpdCommands.GET_QUEUE);
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

  private buildState(payload: StateMsgPayload): void {
    let callBuildQueue = false; // Determines if we need to update the queue
    this.ampdBlockUiService.stop();
    const hasSongChanged = payload.currentSong.id !== this.currentSong.id;

    /* Call buildQueue once if there is no current track set */
    if ('id' in this.currentSong === false) {
      callBuildQueue = true;
    }

    // Build the currentSong object - holds info about the song currently played
    this.currentSong = new QueueTrack(payload.currentSong);
    this.currentSong.elapsedFormatted = this.getFormattedElapsedTime(
      payload.serverStatus.elapsedTime
    );
    this.currentSong.progress = payload.serverStatus.elapsedTime;

    this.controlPanel = payload.controlPanel;
    this.currentState = payload.serverStatus.state;
    this.volume = payload.serverStatus.volume;

    if (hasSongChanged) {
      this.service.sendMessage(InternalCommands.UPDATE_COVER);
    }

    if (callBuildQueue) {
      this.webSocketService.send(MpdCommands.GET_QUEUE);
    }
  }

  private buildStateReceiver() {
    this.stateSubs.subscribe((message: ServerStatusRootImpl) => {
      try {
        this.buildState(message.payload);
      } catch (error) {
        console.error(`Error handling message:`, message);
      }
    });
  }
}

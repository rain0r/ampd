import {Component, HostBinding, HostListener, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AmpdBlockUiService} from '../shared/block/ampd-block-ui.service';
import {InternalCommands} from '../shared/commands/internal';
import {ControlPanelImpl, IControlPanel,} from '../shared/messages/incoming/control-panel';
import {ServerStatusRootImpl} from '../shared/messages/incoming/state-messages';
import {StateMsgPayload} from '../shared/messages/incoming/state-msg-payload';
import {QueueTrack} from '../shared/models/queue-track';
import {MpdCommands} from '../shared/mpd/mpd-commands';
import {MessageService} from '../shared/services/message.service';
import {WebSocketService} from '../shared/services/web-socket.service';
import {OverlayContainer} from '@angular/cdk/overlay';

const THEME_DARKNESS_SUFFIX = `-dark`;

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent implements OnInit {
  private controlPanel: IControlPanel = new ControlPanelImpl();
  private currentSong: QueueTrack = new QueueTrack();
  private volume: number = 0;
  private stateSubs: Observable<ServerStatusRootImpl>;
  private currentState: string = '';

  @HostBinding('class') activeThemeCssClass: string = '';
  isThemeDark = false;
  activeTheme: string = '';
  themes: string[] = [
    'deeppurple-amber',
    'indigo-pink',
    'pink-bluegrey',
    'purple-green',
  ];

  constructor(private webSocketService: WebSocketService,
              private ampdBlockUiService: AmpdBlockUiService,
              private messageService: MessageService,
              private overlayContainer: OverlayContainer,) {
    this.ampdBlockUiService.start();

    this.stateSubs = this.webSocketService.getStateSubscription();
    this.buildStateReceiver();
    this.webSocketService.send(MpdCommands.GET_QUEUE);

    this.setActiveTheme('deeppurple-amber', /* darkness: */ false)
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
    let hasSongChanged = false;

    /* Call buildQueue once if there is no current track set */
    if ('id' in this.currentSong === true) {
      if (
          payload.currentSong &&
          payload.currentSong.id !== this.currentSong.id
      ) {
        hasSongChanged = true;
      }
    } else {
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
      this.messageService.sendMessage(InternalCommands.UPDATE_COVER);
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
        console.error(
            `Error handling message: ${message.type}, error: ${error}`
        );
      }
    });
  }

  setActiveTheme(theme: string, darkness: boolean = false) {
    if (darkness === null)
      darkness = this.isThemeDark;
    else if (this.isThemeDark === darkness) {
      if (this.activeTheme === theme) return
    } else
      this.isThemeDark = darkness;

    this.activeTheme = theme;

    const cssClass = darkness === true ? theme + THEME_DARKNESS_SUFFIX : theme;

    const classList = this.overlayContainer.getContainerElement().classList;
    if (classList.contains(this.activeThemeCssClass))
      classList.replace(this.activeThemeCssClass, cssClass);
    else
      classList.add(cssClass);

    this.activeThemeCssClass = cssClass;
  }

  toggleDarkness() {
    this.setActiveTheme(this.activeTheme, !this.isThemeDark)
  }
}

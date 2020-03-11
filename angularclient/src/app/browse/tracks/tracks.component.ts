import { Component, HostListener, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectionConfig } from '../../shared/connection-config/connection-config';
import { IMpdTrack, MpdTrack } from '../../shared/messages/incoming/mpd-track';
import { MpdCommands } from '../../shared/mpd/mpd-commands';
import { MessageService } from '../../shared/services/message.service';
import { NotificationService } from '../../shared/services/notification.service';
import { WebSocketService } from '../../shared/services/web-socket.service';
import { Filterable } from '../filterable';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.css'],
})
export class TracksComponent extends Filterable {
  @Input() public titleQueue: MpdTrack[] = [];
  public getParamDir = '';

  constructor(
    private notificationService: NotificationService,
    private webSocketService: WebSocketService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {
    super(messageService);
    this.getParamDir =
      this.activatedRoute.snapshot.queryParamMap.get('dir') || '/';
  }

  @HostListener('click', ['$event'])
  public onPlayTitle(track: IMpdTrack): void {
    if (event) {
      event.stopPropagation();
    }
    if (track instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_PLAY_TRACK, {
      path: track.file,
    });
    this.notificationService.popUp(`Playing title: "${track.title}"`);
  }

  @HostListener('click', ['$event'])
  public onAddTitle(track: IMpdTrack): void {
    if (event) {
      event.stopPropagation();
    }
    if (track instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_TRACK, {
      path: track.file,
    });
    this.notificationService.popUp(`Added title: "${track.title}"`);
  }

  public coverUrl() {
    const cc = ConnectionConfig.get();
    const currentCoverUrl = 'find-cover';
    // Add a query param to trigger an image change in the browser
    return `${cc.coverServer}/${currentCoverUrl}?path=${encodeURIComponent(
      this.getParamDir
    )}`;
  }
}

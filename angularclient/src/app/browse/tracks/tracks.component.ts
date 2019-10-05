import { Component, HostListener, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { IMpdTrack, MpdTrack } from '../../shared/messages/incoming/mpd-track';
import { MpdCommands } from '../../shared/mpd/mpd-commands';
import { NotificationService } from '../../shared/services/notification.service';
import { WebSocketService } from '../../shared/services/web-socket.service';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.css'],
})
export class TracksComponent {
  @Input() public titleQueue: MpdTrack[] = [];
  public dir = '';

  constructor(
    private notificationService: NotificationService,
    private webSocketService: WebSocketService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if ('dir' in params) {
        this.dir = params.dir;
      }
    });
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
}

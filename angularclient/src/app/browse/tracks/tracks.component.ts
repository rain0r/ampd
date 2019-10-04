import { Component, HostListener, Input } from '@angular/core';
import { IMpdSong, MpdSong } from '../../shared/messages/incoming/mpd-song';
import { MpdCommands } from '../../shared/mpd/mpd-commands';
import { NotificationService } from '../../shared/services/notification.service';
import { WebSocketService } from '../../shared/services/web-socket.service';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.css'],
})
export class TracksComponent {
  @Input() public titleQueue: MpdSong[] = [];

  constructor(
    private notificationService: NotificationService,
    private webSocketService: WebSocketService
  ) {}

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
    this.notificationService.popUp(`Playing title: "${song.title}"`);
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
    this.notificationService.popUp(`Added title: "${song.title}"`);
  }
}

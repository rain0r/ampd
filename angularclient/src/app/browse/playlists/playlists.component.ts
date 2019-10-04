import { Component, Input } from '@angular/core';
import { Playlist } from '../../shared/messages/incoming/playlist';
import { MpdCommands } from '../../shared/mpd/mpd-commands';
import { NotificationService } from '../../shared/services/notification.service';
import { WebSocketService } from '../../shared/services/web-socket.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css'],
})
export class PlaylistsComponent {
  @Input() public playlistQueue: Playlist[] = [];

  constructor(
    private notificationService: NotificationService,
    private webSocketService: WebSocketService
  ) {}

  public onClickPlaylist(event: Playlist): void {
    this.webSocketService.sendData(MpdCommands.ADD_PLAYLIST, {
      playlist: event.name,
    });
    this.notificationService.popUp(`Added playlist: "${event.name}"`);
  }
}

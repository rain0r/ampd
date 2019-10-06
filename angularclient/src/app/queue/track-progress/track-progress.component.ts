import { Component, Input, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { QueueTrack } from '../../shared/models/queue-track';
import { MpdCommands } from '../../shared/mpd/mpd-commands';
import { WebSocketService } from '../../shared/services/web-socket.service';

@Component({
  selector: 'app-track-progress',
  templateUrl: './track-progress.component.html',
  styleUrls: ['./track-progress.component.css'],
})
export class TrackProgressComponent {
  @Input() public currentSong: QueueTrack = new QueueTrack();

  constructor(private webSocketService: WebSocketService) {}

  public handleCurrentSongProgressSlider(event: MatSliderChange): void {
    this.webSocketService.sendData(MpdCommands.SET_SEEK, {
      value: event.value,
    });
  }
}

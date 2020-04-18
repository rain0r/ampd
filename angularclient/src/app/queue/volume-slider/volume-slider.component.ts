import { Component, Input } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { MpdCommands } from '../../shared/mpd/mpd-commands';
import { WebSocketService } from '../../shared/services/web-socket.service';

@Component({
  selector: 'app-volume-slider',
  templateUrl: './volume-slider.component.html',
  styleUrls: ['./volume-slider.component.scss'],
})
export class VolumeSliderComponent {
  @Input() public volume: number = 0;

  constructor(private webSocketService: WebSocketService) {}

  public handleVolumeSlider(event: MatSliderChange): void {
    this.webSocketService.sendData(MpdCommands.SET_VOLUME, {
      value: event.value,
    });
  }
}

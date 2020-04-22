import {
  Component,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  ControlPanelImpl,
  IControlPanel,
} from '../../shared/messages/incoming/control-panel';
import { MpdCommands } from '../../shared/mpd/mpd-commands';
import { WebSocketService } from '../../shared/services/web-socket.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
})
export class ControlPanelComponent implements OnChanges {
  @Input() public currentState: string = '';
  @Input() private controlPanel: IControlPanel = new ControlPanelImpl();

  constructor(
    private webSocketService: WebSocketService,
    private notificationService: NotificationService
  ) {}

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

  public onClearQueue(): void {
    this.webSocketService.send(MpdCommands.RM_ALL);
    this.webSocketService.send(MpdCommands.GET_QUEUE);
    this.notificationService.popUp('Cleared queue');
  }

  public ngOnChanges(changes: SimpleChanges) {
    const newState: SimpleChange = changes.currentState;
    if (newState && newState.currentValue) {
      this.currentState = newState.currentValue;
    }
  }
}

import { Component, Input } from '@angular/core';
import {
  ControlPanelImpl,
  IControlPanel,
} from '../../shared/messages/incoming/control-panel';

@Component({
  selector: 'app-mpd-modes',
  templateUrl: './mpd-modes.component.html',
  styleUrls: ['./mpd-modes.component.css'],
})
export class MpdModesComponent {
  @Input() public controlPanel: IControlPanel = new ControlPanelImpl();
}

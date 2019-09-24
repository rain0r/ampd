import { MatSnackBar } from '@angular/material';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { ConnectionConfiguration } from '../connection-configuration';
import { StompService } from '@stomp/ng2-stompjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  ampdVersion: string = environment.ampdVersion;
  model: ConnectionConfiguration;
  submitted = false;

  constructor(
    private snackBar: MatSnackBar,
    private stompService: StompService
  ) {
    this.model = this.buildModel();
  }

  private buildModel(): ConnectionConfiguration {
    const model = ConnectionConfiguration.get();

    if (!model.webSocketServer) {
      model.webSocketServer = environment.webSocketServer;
    }

    if (!model.coverServer) {
      model.coverServer = environment.coverServer;
    }

    return model;
  }

  onSubmit() {
    this.submitted = true;
  }

  saveSettings() {
    this.popUp('Saved settings.');
    const data = JSON.stringify(this.model);
    localStorage.setItem(ConnectionConfiguration.key, data);
    this.stompService.initAndConnect();
  }

  private popUp(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
    });
  }
}

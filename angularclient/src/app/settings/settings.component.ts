import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { StompService } from '@stomp/ng2-stompjs';
import { environment } from '../../environments/environment';
import { ConnectionConfiguration } from '../connection-configuration';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  public ampdVersion: string = environment.ampdVersion;
  public model: ConnectionConfiguration;
  public submitted = false;

  constructor(
    private snackBar: MatSnackBar,
    private stompService: StompService
  ) {
    this.model = this.buildModel();
  }

  public onSubmit() {
    this.submitted = true;
  }

  public saveSettings() {
    this.popUp('Saved settings.');
    const data = JSON.stringify(this.model);
    localStorage.setItem(ConnectionConfiguration.key, data);
    this.stompService.initAndConnect();
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

  private popUp(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
    });
  }
}

import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { StompService } from '@stomp/ng2-stompjs';
import { environment } from '../../environments/environment';
import { ConnectionConfig } from '../shared/connection-config/connection-config';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  private ampdVersion: string = environment.ampdVersion;
  private gitCommitId: string = environment.gitCommitId;
  private model: ConnectionConfig;
  private submitted = false;

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
    localStorage.setItem(ConnectionConfig.key, data);
    this.stompService.initAndConnect();
  }

  private buildModel(): ConnectionConfig {
    const model = ConnectionConfig.get();

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

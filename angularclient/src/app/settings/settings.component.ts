import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { StompService } from '@stomp/ng2-stompjs';
import { environment } from '../../environments/environment';
import { ConnectionConfig } from '../shared/connection-config/connection-config';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  private ccModel: ConnectionConfig;
  private submitted = false;
  private ampdVersion;
  private gitCommitId;

  constructor(
    private snackBar: MatSnackBar,
    private stompService: StompService
  ) {
    this.ccModel = ConnectionConfig.get();
    this.ampdVersion = environment.ampdVersion;
    this.gitCommitId = environment.gitCommitId;
  }

  public onSubmit() {
    this.submitted = true;
  }

  public saveSettings() {
    this.popUp('Saved settings.');
    const data = JSON.stringify(this.ccModel);
    localStorage.setItem(ConnectionConfig.key, data);
    this.stompService.initAndConnect();
  }

  private popUp(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
    });
  }
}

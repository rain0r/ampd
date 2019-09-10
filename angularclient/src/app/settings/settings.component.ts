import { MatSnackBar } from '@angular/material';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { ConnectionConfiguration } from '../connection-configuration';
import { StompService } from '@stomp/ng2-stompjs';
import { WebSocketService } from '../shared/services/web-socket.service';
import { Message } from '@stomp/stompjs';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  ampdVersion: string = environment.ampdVersion;
  model: ConnectionConfiguration;
  submitted = false;
  stompSubscription: Observable<Message>;

  constructor(
    private snackBar: MatSnackBar,
    private appComponent: AppComponent,
    private stompService: StompService,
    private webSocketService: WebSocketService
  ) {
    this.model = this.buildModel();
    this.stompSubscription = this.webSocketService.getStompSubscription();
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
    console.log(this.model);
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

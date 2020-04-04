import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { StompService } from '@stomp/ng2-stompjs';
import { environment } from '../../environments/environment';
import { ConnectionConfig } from '../shared/connection-config/connection-config';

const THEME_DARKNESS_SUFFIX = `-dark`;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  // Theming
  @HostBinding('class') public activeThemeCssClass: string = '';
  public isThemeDark = false;
  public activeTheme: string = '';
  public themes: string[] = [
    'deeppurple-amber',
    'indigo-pink',
    'pink-bluegrey',
    'purple-green',
  ];
  private ampdVersion: string = environment.ampdVersion;
  private gitCommitId: string = environment.gitCommitId;
  private model: ConnectionConfig;
  private submitted = false;

  constructor(
    private snackBar: MatSnackBar,
    private stompService: StompService,
    private overlayContainer: OverlayContainer
  ) {
    this.setActiveTheme('deeppurple-amber', /* darkness: */ false);
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

  public setActiveTheme(theme: string, darkness: boolean = false) {
    if (darkness === null) {
      darkness = this.isThemeDark;
    } else if (this.isThemeDark === darkness) {
      if (this.activeTheme === theme) {
        return;
      }
    } else {
      this.isThemeDark = darkness;
    }

    console.log(this.isThemeDark);
    this.activeTheme = theme;

    const cssClass = darkness === true ? theme + THEME_DARKNESS_SUFFIX : theme;

    const classList = this.overlayContainer.getContainerElement().classList;
    if (classList.contains(this.activeThemeCssClass)) {
      classList.replace(this.activeThemeCssClass, cssClass);
    } else {
      classList.add(cssClass);
    }

    this.activeThemeCssClass = cssClass;
  }

  public toggleDarkness() {
    this.setActiveTheme(this.activeTheme, !this.isThemeDark);
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

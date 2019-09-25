import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { QueueComponent } from './queue/queue.component';
import { BrowseComponent } from './browse/browse.component';
import { SecondsToMmSsPipe } from './shared/pipes/SecondsToMmSsPipe';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './shared/routing/app-routing.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StompConfig, StompService } from '@stomp/ng2-stompjs';
import { BlockUIModule } from 'ng-block-ui';
import { WebSocketService } from './shared/services/web-socket.service';
import { SearchComponent } from './search/search.component';
import { SettingsComponent } from './settings/settings.component';
import { CoverModalComponent } from 'src/app/shared/cover-modal/cover-modal.component';
import { ConnectionConfiguration } from './connection-configuration';
import { AmpdBlockUiService } from './shared/block/ampd-block-ui.service';
import { EncodeURIComponentPipe } from './shared/pipes/EncodeURI';

@NgModule({
  declarations: [
    AppComponent,
    QueueComponent,
    BrowseComponent,
    EncodeURIComponentPipe,
    SearchComponent,
    SecondsToMmSsPipe,
    SearchComponent,
    SettingsComponent,
    CoverModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    FlexLayoutModule,
    BlockUIModule.forRoot(),
  ],
  providers: [
    WebSocketService,
    AmpdBlockUiService,
    StompService,
    {
      provide: StompConfig,
      useValue: AppModule.loadConnectionConfiguration(),
    },
  ],
  entryComponents: [CoverModalComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
  static loadConnectionConfiguration(): StompConfig {
    const connectionConfiguration: ConnectionConfiguration = ConnectionConfiguration.get();
    const stompConfig: StompConfig = {
      // Which server?
      url: connectionConfiguration.webSocketServer,

      // Headers
      // Typical keys: login, passcode, host
      headers: {},

      // How often to heartbeat?
      // Interval in milliseconds, set to 0 to disable
      heartbeat_in: 0, // Typical value 0 - disabled
      heartbeat_out: 1000, // Typical value 20000 - every 20 seconds
      // Wait in milliseconds before attempting auto reconnect
      // Set to 0 to disable
      // Typical value 5000 (5 seconds)
      reconnect_delay: 100,

      // Will log diagnostics on console
      debug: false,
    };
    return stompConfig;
  }
}

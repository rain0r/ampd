import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  InjectableRxStompConfig,
  RxStompService,
  rxStompServiceFactory,
} from "@stomp/ng2-stompjs";
import { CoverModalComponent } from "src/app/queue/cover-modal/cover-modal.component";
import { AppComponent } from "./app.component";
import { BrowseComponent } from "./browse/browse.component";
import { DirectoriesComponent } from "./browse/directories/directories.component";
import { BrowseNavigationComponent } from "./browse/navigation/browse-navigation.component";
import { PlaylistsComponent } from "./browse/playlists/playlists.component";
import { TracksComponent } from "./browse/tracks/tracks.component";
import { ControlPanelComponent } from "./queue/control-panel/control-panel.component";
import { MpdModesComponent } from "./queue/mpd-modes/mpd-modes.component";
import { QueueHeaderComponent } from "./queue/queue-header/queue-header.component";
import { QueueComponent } from "./queue/queue.component";
import { TrackProgressComponent } from "./queue/track-progress/track-progress.component";
import { TrackTableComponent } from "./queue/track-table/track-table.component";
import { VolumeSliderComponent } from "./queue/volume-slider/volume-slider.component";
import { SearchComponent } from "./search/search.component";
import { SettingsComponent } from "./settings/settings.component";
import { ConnConfUtil } from "./shared/conn-conf/conn-conf-util";
import { EncodeURIComponentPipe } from "./shared/pipes/EncodeURI";
import { DirectoryFilterPipe } from "./shared/pipes/filter/DirectoryFilter";
import { MpdTrackFilterPipe } from "./shared/pipes/filter/MpdTrackFilter";
import { PlaylistFilterPipe } from "./shared/pipes/filter/PlaylistFilter";
import { SecondsToMmSsPipe } from "./shared/pipes/SecondsToMmSs";
import { AppRoutingModule } from "./app-routing.module";
import { BrowseService } from "./shared/services/browse.service";
import { MessageService } from "./shared/services/message.service";
import { NotificationService } from "./shared/services/notification.service";
import { WebSocketService } from "./shared/services/web-socket.service";
import { SecondsToHhMmSsPipe } from "./shared/pipes/SecondsToHhMmSs";
import { NavbarComponent } from "./navbar/navbar.component";
import { DeviceDetectorModule } from "ngx-device-detector";
import { HttpClientModule } from "@angular/common/http";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatSliderModule } from "@angular/material/slider";
import { MatDividerModule } from "@angular/material/divider";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatListModule } from "@angular/material/list";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { SavePlaylistModalComponent } from "./queue/save-playlist-modal/save-playlist-modal.component";
import { PlaylistInfoModalComponent } from "./browse/playlists/playlist-info-modal/playlist-info-modal.component";
import { TrackDataTableComponent } from "./shared/track-table/track-data-table.component";
import { NgxFilesizeModule } from "ngx-filesize";

@NgModule({
  declarations: [
    AppComponent,
    BrowseComponent,
    ControlPanelComponent,
    CoverModalComponent,
    DirectoriesComponent,
    DirectoryFilterPipe,
    EncodeURIComponentPipe,
    MpdModesComponent,
    MpdTrackFilterPipe,
    NavbarComponent,
    BrowseNavigationComponent,
    PlaylistFilterPipe,
    PlaylistsComponent,
    QueueComponent,
    QueueHeaderComponent,
    SearchComponent,
    SecondsToHhMmSsPipe,
    SecondsToMmSsPipe,
    SettingsComponent,
    TrackProgressComponent,
    TrackTableComponent,
    TrackDataTableComponent,
    TracksComponent,
    VolumeSliderComponent,
    SavePlaylistModalComponent,
    PlaylistInfoModalComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    DeviceDetectorModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxFilesizeModule,
    // Material
    MatIconModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatGridListModule,
    MatSliderModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatTableModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatListModule,
    MatSnackBarModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  providers: [
    BrowseService,
    MessageService,
    NotificationService,
    WebSocketService,
    {
      provide: InjectableRxStompConfig,
      useValue: ConnConfUtil.loadStompConfig(),
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    },
  ],
  entryComponents: [CoverModalComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

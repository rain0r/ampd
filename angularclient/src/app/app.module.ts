import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CoverModalComponent } from "src/app/queue/cover-modal/cover-modal.component";
import { AppComponent } from "./app.component";
import { BrowseComponent } from "./browse/browse.component";
import { DirectoriesComponent } from "./browse/directories/directories.component";
import { BrowseNavigationComponent } from "./browse/navigation/browse-navigation.component";
import { PlaylistsComponent } from "./browse/playlists/playlists.component";
import { TracksComponent } from "./browse/tracks/tracks.component";
import { ControlPanelComponent } from "./queue/control-panel/control-panel.component";
import { MpdModeComponent } from "./queue/mpd-modes/mpd-mode.component";
import { QueueHeaderComponent } from "./queue/queue-header/queue-header.component";
import { QueueComponent } from "./queue/queue.component";
import { TrackProgressComponent } from "./queue/track-progress/track-progress.component";
import { TrackTableComponent } from "./queue/track-table/track-table.component";
import { VolumeSliderComponent } from "./queue/volume-slider/volume-slider.component";
import { SearchComponent } from "./search/search.component";
import { SettingsComponent } from "./settings/settings.component";
import { EncodeURIComponentPipe } from "./shared/pipes/encode-uri.pipe";
import { DirectoryFilterPipe } from "./shared/pipes/filter/DirectoryFilter";
import { PlaylistFilterPipe } from "./shared/pipes/filter/PlaylistFilter";
import { SecondsToMmSsPipe } from "./shared/pipes/seconds-to-mm-ss.pipe";
import { AppRoutingModule } from "./app-routing.module";
import { MessageService } from "./shared/services/message.service";
import { NotificationService } from "./shared/services/notification.service";
import { SecondsToHhMmSsPipe } from "./shared/pipes/seconds-to-hh-mm-ss.pipe";
import { NavbarComponent } from "./navbar/navbar.component";
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
import { TrackTableDataComponent } from "./shared/track-table/track-table-data.component";
import { NgxFilesizeModule } from "ngx-filesize";
import {
  InjectableRxStompConfig,
  RxStompService,
  rxStompServiceFactory,
} from "@stomp/ng2-stompjs";
import { AmpdRxStompConfig } from "./ampd-rx-stomp-config.service";
import { ReplaceNullWithTextPipe } from "./shared/pipes/replace-null-with-text.pipe";
import { ThemeComponent } from "./settings/frontend/theme/theme.component";
import { DisplayCoverComponent } from "./settings/frontend/display-cover/display-cover.component";
import { TabTitleComponent } from "./settings/frontend/tab-title/tab-title.component";
import { HelpModalComponent } from "./navbar/help-dialog/help-modal.component";
import { MapEntriesPipe } from "./shared/pipes/map-entries.pipe";
import { ErrorComponent } from "./shared/error/error.component";
import { CoverCacheComponent } from "./settings/backend/cover-cache/cover-cache.component";
import { MbCoverServiceComponent } from "./settings/backend/music-brainz-cover-service/mb-cover-service.component";
import { CoverBlacklistComponent } from "./settings/backend/cover-blacklist/cover-blacklist.component";
import { ResetModesOnClearComponent } from "./settings/backend/reset-modes-on-clear/reset-modes-on-clear.component";
import { MusicDirectoryComponent } from "./settings/backend/music-directory/music-directory.component";
import { MpdServerComponent } from "./settings/backend/mpd-server/mpd-server.component";
import { MpdPortComponent } from "./settings/backend/mpd-port/mpd-port.component";
import { PlaylistPropertiesComponent } from "./settings/backend/playlist-properties/playlist-properties.component";
import { MatTabsModule } from "@angular/material/tabs";
import { BackendAddressComponent } from "./settings/frontend/backend-address/backend-address.component";
import { ServerStatisticsComponent } from "./settings/server-statistics/server-statistics.component";
import { AddStreamModalComponent } from "./queue/add-stream-modal/add-stream-modal.component";

@NgModule({
  declarations: [
    AppComponent,
    BrowseComponent,
    ControlPanelComponent,
    CoverModalComponent,
    DirectoriesComponent,
    DirectoryFilterPipe,
    EncodeURIComponentPipe,
    ReplaceNullWithTextPipe,
    MpdModeComponent,
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
    TrackTableDataComponent,
    TracksComponent,
    VolumeSliderComponent,
    SavePlaylistModalComponent,
    PlaylistInfoModalComponent,
    ThemeComponent,
    DisplayCoverComponent,
    TabTitleComponent,
    HelpModalComponent,
    MapEntriesPipe,
    ErrorComponent,
    CoverCacheComponent,
    MbCoverServiceComponent,
    CoverBlacklistComponent,
    ResetModesOnClearComponent,
    MusicDirectoryComponent,
    MpdServerComponent,
    MpdPortComponent,
    PlaylistPropertiesComponent,
    BackendAddressComponent,
    ServerStatisticsComponent,
    AddStreamModalComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxFilesizeModule,
    // Material
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
  ],
  providers: [
    MessageService,
    NotificationService,
    {
      provide: InjectableRxStompConfig,
      useClass: AmpdRxStompConfig,
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

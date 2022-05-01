import { DragDropModule } from "@angular/cdk/drag-drop";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import {
  MatTooltipModule,
  MAT_TOOLTIP_DEFAULT_OPTIONS,
} from "@angular/material/tooltip";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  InjectableRxStompConfig,
  RxStompService,
  rxStompServiceFactory,
} from "@stomp/ng2-stompjs";
import { LightgalleryModule } from "lightgallery/angular";
import { NgxFilesizeModule } from "ngx-filesize";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AlbumItemComponent } from "./browse/albums/album-item/album-item.component";
import { AlbumModalComponent } from "./browse/albums/album-modal/album-modal.component";
import { AlbumsPaginationComponent } from "./browse/albums/albums-pagination/albums-pagination.component";
import { AlbumsComponent } from "./browse/albums/albums.component";
import { BrowseComponent } from "./browse/browse.component";
import { CoverGridEntryComponent } from "./browse/directories/cover-grid/cover-grid-entry/cover-grid-entry.component";
import { CoverGridComponent } from "./browse/directories/cover-grid/cover-grid.component";
import { DirectoriesComponent } from "./browse/directories/directories.component";
import { DirectoryEntryComponent } from "./browse/directories/directory-entry/directory-entry.component";
import { VirtualScrollDirectoriesComponent } from "./browse/directories/virtual-scroll-directories/virtual-scroll-directories.component";
import { BrowseNavigationComponent } from "./browse/navigation/browse-navigation.component";
import { PlaylistEntryComponent } from "./browse/playlists/playlist-entry/playlist-entry.component";
import { PlaylistInfoModalComponent } from "./browse/playlists/playlist-info-modal/playlist-info-modal.component";
import { PlaylistsComponent } from "./browse/playlists/playlists.component";
import { VirtualScrollPlaylistsComponent } from "./browse/playlists/virtual-scroll-playlists/virtual-scroll-playlists.component";
import { TracksComponent } from "./browse/tracks/tracks.component";
import { HelpModalComponent } from "./navbar/help-modal/help-modal.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { AddStreamModalComponent } from "./queue/add-stream-modal/add-stream-modal.component";
import { ControlPanelComponent } from "./queue/control-panel/control-panel.component";
import { MpdModeComponent } from "./queue/mpd-modes/mpd-mode.component";
import { QueueHeaderComponent } from "./queue/queue-header/queue-header.component";
import { QueueComponent } from "./queue/queue.component";
import { SavePlaylistModalComponent } from "./queue/save-playlist-modal/save-playlist-modal.component";
import { TrackProgressComponent } from "./queue/track-progress/track-progress.component";
import { TrackTableComponent } from "./queue/track-table/track-table.component";
import { VolumeSliderComponent } from "./queue/volume-slider/volume-slider.component";
import { SearchComponent } from "./search/search.component";
import { ServerStatisticsComponent } from "./settings/admin/server-statistics/server-statistics.component";
import { UpdateDatabaseComponent } from "./settings/admin/update-database/update-database.component";
import { CoverCacheComponent } from "./settings/backend/cover-cache/cover-cache.component";
import { MpdPortComponent } from "./settings/backend/mpd-port/mpd-port.component";
import { MpdServerComponent } from "./settings/backend/mpd-server/mpd-server.component";
import { MbCoverServiceComponent } from "./settings/backend/music-brainz-cover-service/mb-cover-service.component";
import { MusicDirectoryComponent } from "./settings/backend/music-directory/music-directory.component";
import { PlaylistPropertiesComponent } from "./settings/backend/playlist-properties/playlist-properties.component";
import { ResetModesOnClearComponent } from "./settings/backend/reset-modes-on-clear/reset-modes-on-clear.component";
import { BackendAddressComponent } from "./settings/frontend/backend-address/backend-address.component";
import { DisplayCoverComponent } from "./settings/frontend/display-cover/display-cover.component";
import { PaginationComponent } from "./settings/frontend/pagination/pagination.component";
import { TabTitleComponent } from "./settings/frontend/tab-title/tab-title.component";
import { ThemeComponent } from "./settings/frontend/theme/theme.component";
import { VirtualScrollComponent } from "./settings/frontend/virtual-scroll/virtual-scroll.component";
import { SettingsComponent } from "./settings/settings.component";
import { customTooltipDefaults } from "./shared/custom-tooltip-defaults";
import { ErrorComponent } from "./shared/error/error.component";
import { EncodeURIComponentPipe } from "./shared/pipes/encode-uri.pipe";
import { DirectoryFilterStartLetterPipePipe } from "./shared/pipes/filter/directory-filter-start-letter-pipe.pipe";
import { DirectoryFilterPipe } from "./shared/pipes/filter/directory-filter.pipe";
import { PlaylistFilterPipe } from "./shared/pipes/filter/playlist-filter.pipe";
import { MapEntriesPipe } from "./shared/pipes/map-entries.pipe";
import { ReplaceNullWithTextPipe } from "./shared/pipes/replace-null-with-text.pipe";
import { SecondsToHhMmSsPipe } from "./shared/pipes/seconds-to-hh-mm-ss.pipe";
import { SecondsToMmSsPipe } from "./shared/pipes/seconds-to-mm-ss.pipe";
import { AmpdRxStompConfig } from "./shared/services/ampd-rx-stomp-config.service";
import { MessageService } from "./shared/services/message.service";
import { NotificationService } from "./shared/services/notification.service";
import { TrackTableDataComponent } from "./shared/track-table/track-table-data.component";

@NgModule({
  declarations: [
    AppComponent,
    BrowseComponent,
    ControlPanelComponent,
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
    ResetModesOnClearComponent,
    MusicDirectoryComponent,
    MpdServerComponent,
    MpdPortComponent,
    PlaylistPropertiesComponent,
    BackendAddressComponent,
    ServerStatisticsComponent,
    AddStreamModalComponent,
    UpdateDatabaseComponent,
    DirectoryFilterStartLetterPipePipe,
    VirtualScrollComponent,
    VirtualScrollDirectoriesComponent,
    VirtualScrollPlaylistsComponent,
    PlaylistEntryComponent,
    DirectoryEntryComponent,
    CoverGridComponent,
    CoverGridEntryComponent,
    PaginationComponent,
    AlbumsComponent,
    AlbumModalComponent,
    AlbumsPaginationComponent,
    AlbumItemComponent,
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
    ScrollingModule,
    BrowserModule,
    LightgalleryModule,
    // Material
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    DragDropModule,
    MatFormFieldModule,
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
    MatTooltipModule,
  ],
  providers: [
    {
      provide: InjectableRxStompConfig,
      useClass: AmpdRxStompConfig,
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: customTooltipDefaults },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

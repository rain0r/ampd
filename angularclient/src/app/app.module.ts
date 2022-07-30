import { ScrollingModule } from "@angular/cdk/scrolling";
import { Location, TitleCasePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LightgalleryModule } from "lightgallery/angular";
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
import { GenreAlbumsComponent } from "./browse/genres/genre-albums/genre-albums.component";
import { GenresComponent } from "./browse/genres/genres.component";
import { BrowseNavigationComponent } from "./browse/navigation/browse-navigation.component";
import { PlaylistEntryComponent } from "./browse/playlists/playlist-entry/playlist-entry.component";
import { PlaylistInfoModalComponent } from "./browse/playlists/playlist-info-modal/playlist-info-modal.component";
import { PlaylistsComponent } from "./browse/playlists/playlists.component";
import { VirtualScrollPlaylistsComponent } from "./browse/playlists/virtual-scroll-playlists/virtual-scroll-playlists.component";
import { TrackInfoModalComponent } from "./browse/tracks/track-info-modal/track-info-modal.component";
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
import { AmpdRxStompConfigService } from "./service/ampd-rx-stomp-config.service";
import { AmpdRxStompService } from "./service/ampd-rx-stomp.service";
import { ServerStatisticsComponent } from "./settings/admin/server-statistics/server-statistics.component";
import { UpdateDatabaseComponent } from "./settings/admin/update-database/update-database.component";
import { BackendAddressComponent } from "./settings/frontend/backend-address/backend-address.component";
import { DisplayCoverComponent } from "./settings/frontend/display-cover/display-cover.component";
import { PaginationComponent } from "./settings/frontend/pagination/pagination.component";
import { TabTitleComponent } from "./settings/frontend/tab-title/tab-title.component";
import { ThemeComponent } from "./settings/frontend/theme/theme.component";
import { VirtualScrollComponent } from "./settings/frontend/virtual-scroll/virtual-scroll.component";
import { SettingsComponent } from "./settings/settings.component";
import { AmpdErrorHandler } from "./shared/ampd-error-handler";
import { ErrorDialogComponent } from "./shared/error-dialog/error-dialog.component";
import { ErrorComponent } from "./shared/error/error.component";
import { KeyValueTableComponent } from "./shared/key-value-table/key-value-table.component";
import { MaterialMetaModule } from "./shared/material-meta/material-meta.module";
import { EncodeURIComponentPipe } from "./shared/pipes/encode-uri.pipe";
import { FileSizePipe } from "./shared/pipes/file-size.pipe";
import { DirectoryFilterStartLetterPipePipe } from "./shared/pipes/filter/directory-filter-start-letter-pipe.pipe";
import { DirectoryFilterPipe } from "./shared/pipes/filter/directory-filter.pipe";
import { PlaylistFilterPipe } from "./shared/pipes/filter/playlist-filter.pipe";
import { MapEntriesPipe } from "./shared/pipes/map-entries.pipe";
import { ReplaceNullWithTextPipe } from "./shared/pipes/replace-null-with-text.pipe";
import { SecondsToHhMmSsPipe } from "./shared/pipes/seconds-to-hh-mm-ss.pipe";
import { SecondsToMmSsPipe } from "./shared/pipes/seconds-to-mm-ss.pipe";
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
    TrackInfoModalComponent,
    KeyValueTableComponent,
    GenresComponent,
    ErrorDialogComponent,
    FileSizePipe,
    GenreAlbumsComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ScrollingModule,
    BrowserModule,
    LightgalleryModule,
    MaterialMetaModule,
  ],
  providers: [
    TitleCasePipe,
    SecondsToMmSsPipe,
    {
      provide: AmpdRxStompService,
      useFactory: (location: Location) => {
        const config = new AmpdRxStompConfigService(location);
        const rxStomp = new AmpdRxStompService();
        rxStomp.configure(config);
        rxStomp.activate();
        return rxStomp;
      },
      deps: [Location],
    },
    {
      provide: ErrorHandler,
      useClass: AmpdErrorHandler,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

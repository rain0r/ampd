import { ScrollingModule } from "@angular/cdk/scrolling";
import { Location } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LightgalleryModule } from "lightgallery/angular";
import { FrontendSettingsService } from "src/app/service/frontend-settings.service";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AlbumItemComponent } from "./browse/albums/album-item/album-item.component";
import { AlbumDialogComponent } from "./browse/albums/album-dialog/album-dialog.component";
import { AlbumsPaginationComponent } from "./browse/albums/albums-pagination/albums-pagination.component";
import { AlbumsComponent } from "./browse/albums/albums.component";
import { BrowseComponent } from "./browse/browse.component";
import { CoverGridEntryComponent } from "./browse/directories/cover-grid/cover-grid-entry/cover-grid-entry.component";
import { CoverGridComponent } from "./browse/directories/cover-grid/cover-grid.component";
import { DirectoriesComponent } from "./browse/directories/directories.component";
import { DirectoryEntryComponent } from "./browse/directories/directory-entry/directory-entry.component";
import { GenreAlbumsComponent } from "./browse/genres/genre-albums/genre-albums.component";
import { GenresComponent } from "./browse/genres/genres.component";
import { BrowseNavigationComponent } from "./browse/navigation/browse-navigation.component";
import { PlaylistEntryComponent } from "./browse/playlists/playlist-entry/playlist-entry.component";
import { PlaylistInfoDialogComponent } from "./browse/playlists/playlist-info-dialog/playlist-info-dialog.component";
import { PlaylistsComponent } from "./browse/playlists/playlists.component";
import { TrackInfoDialogComponent } from "./browse/tracks/track-info-dialog/track-info-dialog.component";
import { TracksComponent } from "./browse/tracks/tracks.component";
import { HelpDialogComponent } from "./navbar/help-dialog/help-dialog.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { AddStreamDialogComponent } from "./queue/add-stream-dialog/add-stream-dialog.component";
import { ControlPanelComponent } from "./queue/control-panel/control-panel.component";
import { MpdModeComponent } from "./queue/mpd-modes/mpd-mode.component";
import { QueueHeaderComponent } from "./queue/queue-header/queue-header.component";
import { QueueComponent } from "./queue/queue.component";
import { SavePlaylistDialogComponent } from "./queue/save-playlist-dialog/save-playlist-dialog.component";
import { TrackProgressComponent } from "./queue/track-progress/track-progress.component";
import { TrackTableComponent } from "./queue/track-table/track-table.component";
import { VolumeSliderComponent } from "./queue/volume-slider/volume-slider.component";
import { SearchComponent } from "./search/search.component";
import { AmpdRxStompConfigService } from "./service/ampd-rx-stomp-config.service";
import { AmpdRxStompService } from "./service/ampd-rx-stomp.service";
import { SettingsService } from "./service/settings.service";
import { ServerStatisticsComponent } from "./settings/admin/server-statistics/server-statistics.component";
import { UpdateDatabaseComponent } from "./settings/admin/update-database/update-database.component";
import { BackendAddressComponent } from "./settings/frontend/backend-address/backend-address.component";
import { DisplayCoverComponent } from "./settings/frontend/display-cover/display-cover.component";
import { PaginationComponent } from "./settings/frontend/pagination/pagination.component";
import { TabTitleComponent } from "./settings/frontend/tab-title/tab-title.component";
import { ThemeComponent } from "./settings/frontend/theme/theme.component";
import { SettingsComponent } from "./settings/settings.component";
import { AmpdErrorHandler } from "./shared/ampd-error-handler";
import { ErrorDialogComponent } from "./shared/error/error-dialog/error-dialog.component";
import { HttpErrorDialogComponent } from "./shared/error/http-error-dialog/http-error-dialog.component";
import { KeyValueTableComponent } from "./shared/key-value-table/key-value-table.component";
import { MaterialMetaModule } from "./shared/material-meta/material-meta.module";
import { CamelCaseTitlePipe } from "./shared/pipes/camel-case-title.pipe";
import { EncodeURIComponentPipe } from "./shared/pipes/encode-uri.pipe";
import { FileSizePipe } from "./shared/pipes/file-size.pipe";
import { DirectoryFilterStartLetterPipePipe as DirectoryFilterStartLetterPipe } from "./shared/pipes/filter/directory-filter-start-letter-pipe";
import { DirectoryFilterPipe } from "./shared/pipes/filter/directory-filter.pipe";
import { PlaylistFilterPipe } from "./shared/pipes/filter/playlist-filter.pipe";
import { MapEntriesPipe } from "./shared/pipes/map-entries.pipe";
import { ReplaceNullWithTextPipe } from "./shared/pipes/replace-null-with-text.pipe";
import { SecondsToHhMmSsPipe } from "./shared/pipes/seconds-to-hh-mm-ss.pipe";
import { SecondsToMmSsPipe } from "./shared/pipes/seconds-to-mm-ss.pipe";
import { TrackTableDataComponent } from "./shared/track-table/track-table-data.component";

function isDarkTheme(service: FrontendSettingsService): unknown {
  return {
    panelClass: service.loadFrontendSettings().darkTheme ? "dark-theme" : "",
  };
}

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
    SavePlaylistDialogComponent,
    PlaylistInfoDialogComponent,
    ThemeComponent,
    DisplayCoverComponent,
    TabTitleComponent,
    HelpDialogComponent,
    MapEntriesPipe,
    BackendAddressComponent,
    ServerStatisticsComponent,
    AddStreamDialogComponent,
    UpdateDatabaseComponent,
    DirectoryFilterStartLetterPipe,
    PlaylistEntryComponent,
    DirectoryEntryComponent,
    CoverGridComponent,
    CoverGridEntryComponent,
    PaginationComponent,
    AlbumsComponent,
    AlbumDialogComponent,
    AlbumsPaginationComponent,
    AlbumItemComponent,
    TrackInfoDialogComponent,
    KeyValueTableComponent,
    GenresComponent,
    ErrorDialogComponent,
    FileSizePipe,
    GenreAlbumsComponent,
    HttpErrorDialogComponent,
    CamelCaseTitlePipe,
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
    CamelCaseTitlePipe,
    SecondsToMmSsPipe,
    ReplaceNullWithTextPipe,
    {
      provide: AmpdRxStompService,
      useFactory: (location: Location, settingsService: SettingsService) => {
        const config = new AmpdRxStompConfigService(location, settingsService);
        const rxStomp = new AmpdRxStompService();
        rxStomp.configure(config);
        rxStomp.activate();
        return rxStomp;
      },
      deps: [Location, SettingsService],
    },
    {
      provide: ErrorHandler,
      useClass: AmpdErrorHandler,
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useFactory: isDarkTheme,
      deps: [FrontendSettingsService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

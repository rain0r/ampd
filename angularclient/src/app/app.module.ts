import { ScrollingModule } from "@angular/cdk/scrolling";
import { Location } from "@angular/common";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from "@angular/material/tooltip";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AlbumDialogComponent } from "./browse/albums/album-dialog/album-dialog.component";
import { AlbumItemComponent } from "./browse/albums/album-item/album-item.component";
import { AlbumsComponent } from "./browse/albums/albums.component";
import { BrowseComponent } from "./browse/browse.component";
import { CoverGridEntryComponent } from "./browse/directories/cover-grid/cover-grid-entry/cover-grid-entry.component";
import { CoverGridComponent } from "./browse/directories/cover-grid/cover-grid.component";
import { DirectoriesComponent } from "./browse/directories/directories.component";
import { DirectoryEntryComponent } from "./browse/directories/directory-entry/directory-entry.component";
import { GenresComponent } from "./browse/genres/genres.component";
import { BrowseNavigationComponent } from "./browse/navigation/browse-navigation.component";
import { PlaylistEntryComponent } from "./browse/playlists/playlist-entry/playlist-entry.component";
import { PlaylistInfoDialogComponent } from "./browse/playlists/playlist-info-dialog/playlist-info-dialog.component";
import { PlaylistsComponent } from "./browse/playlists/playlists.component";
import { AddStreamComponent } from "./browse/radio-streams/add-radio-stream/add-radio-stream.component";
import { ConfirmDeleteStreamDialogComponent } from "./browse/radio-streams/confirm-delete-stream-dialog/confirm-delete-stream-dialog.component";
import { ImportRadioStreamsComponent } from "./browse/radio-streams/import-radio-streams/import-radio-streams.component";
import { RadioStreamListComponent } from "./browse/radio-streams/radio-stream-list/radio-stream-list.component";
import { RadioStreamsComponent } from "./browse/radio-streams/radio-streams.component";
import { RecentlyListenedAlbumsComponent } from "./browse/recently-listened/recently-listened-albums/recently-listened-albums.component";
import { RecentlyListenedComponent } from "./browse/recently-listened/recently-listened.component";
import { TrackInfoDialogComponent } from "./browse/tracks/track-info-dialog/track-info-dialog.component";
import { TracksComponent } from "./browse/tracks/tracks.component";
import { HelpDialogComponent } from "./navbar/help-dialog/help-dialog.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { ControlPanelComponent } from "./queue/control-panel/control-panel.component";
import { MpdModeComponent } from "./queue/mpd-modes/mpd-mode.component";
import { CoverImageComponent } from "./queue/queue-header/cover-image/cover-image.component";
import { QueueHeaderComponent } from "./queue/queue-header/queue-header.component";
import { QueueComponent } from "./queue/queue.component";
import { SavePlaylistDialogComponent } from "./queue/save-playlist-dialog/save-playlist-dialog.component";
import { TrackProgressComponent } from "./queue/track-progress/track-progress.component";
import { AddStreamDialogComponent } from "./queue/track-table/add-stream-dialog/add-stream-dialog.component";
import { TrackTableComponent } from "./queue/track-table/track-table.component";
import { VolumeSliderComponent } from "./queue/volume-slider/volume-slider.component";
import { AdvancedSearchComponent } from "./search/advanced-search/advanced-search.component";
import { DynamicFormInputComponent } from "./search/advanced-search/dynamic-form-input/dynamic-form-input.component";
import { SearchComponent } from "./search/search.component";
import { AmpdRxStompConfigService } from "./service/ampd-rx-stomp-config.service";
import { AmpdRxStompService } from "./service/ampd-rx-stomp.service";
import { SettingsService } from "./service/settings.service";
import { ServerStatisticsComponent } from "./settings/admin/server-statistics/server-statistics.component";
import { UpdateDatabaseComponent } from "./settings/admin/update-database/update-database.component";
import { SettingsComponent } from "./settings/settings.component";
import { AlbumCoverDialogComponent } from "./shared/album-cover-dialog/album-cover-dialog.component";
import { AmpdErrorHandler } from "./shared/ampd-error-handler";
import { ErrorDialogComponent } from "./shared/error/error-dialog/error-dialog.component";
import { KeyValueTableComponent } from "./shared/key-value-table/key-value-table.component";
import { MaterialMetaModule } from "./shared/material-meta/material-meta.module";
import { CamelCaseTitlePipe } from "./shared/pipes/camel-case-title.pipe";
import { EncodeURIComponentPipe } from "./shared/pipes/encode-uri.pipe";
import { FileSizePipe } from "./shared/pipes/file-size.pipe";
import { DirectoryFilterStartLetterPipe } from "./shared/pipes/filter/directory-filter-start-letter-pipe";
import { DirectoryFilterPipe } from "./shared/pipes/filter/directory-filter.pipe";
import { FilterByCategoryPipe } from "./shared/pipes/filter/filter-by-category.pipe";
import { PlaylistFilterPipe } from "./shared/pipes/filter/playlist-filter.pipe";
import { MapEntriesPipe } from "./shared/pipes/map-entries.pipe";
import { ReplaceNullWithTextPipe } from "./shared/pipes/replace-null-with-text.pipe";
import { SecondsToHhMmSsPipe } from "./shared/pipes/seconds-to-hh-mm-ss.pipe";
import { SecondsToMmSsPipe } from "./shared/pipes/seconds-to-mm-ss.pipe";
import { StyleManager } from "./shared/style-manager";
import { TrackTableDataComponent } from "./shared/track-table-data/track-table-data.component";

const prefersReducedMotion =
  typeof matchMedia === "function"
    ? matchMedia("(prefers-reduced-motion)").matches
    : false;

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
    HelpDialogComponent,
    MapEntriesPipe,
    ServerStatisticsComponent,
    AddStreamComponent,
    UpdateDatabaseComponent,
    DirectoryFilterStartLetterPipe,
    PlaylistEntryComponent,
    DirectoryEntryComponent,
    CoverGridComponent,
    CoverGridEntryComponent,
    AlbumsComponent,
    AlbumDialogComponent,
    AlbumItemComponent,
    TrackInfoDialogComponent,
    KeyValueTableComponent,
    GenresComponent,
    ErrorDialogComponent,
    FileSizePipe,
    CamelCaseTitlePipe,
    RadioStreamListComponent,
    FilterByCategoryPipe,
    CoverImageComponent,
    DynamicFormInputComponent,
    AdvancedSearchComponent,
    AddStreamDialogComponent,
    AlbumCoverDialogComponent,
    ImportRadioStreamsComponent,
    RadioStreamsComponent,
    ConfirmDeleteStreamDialogComponent,
    RecentlyListenedComponent,
    RecentlyListenedAlbumsComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule.withConfig({
      disableAnimations: prefersReducedMotion,
    }),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    BrowserModule,
    MaterialMetaModule,
  ],
  providers: [
    CamelCaseTitlePipe,
    SecondsToMmSsPipe,
    ReplaceNullWithTextPipe,
    StyleManager,
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
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: {
        showDelay: 750,
      },
    },
  ],
})
export class AppModule {}

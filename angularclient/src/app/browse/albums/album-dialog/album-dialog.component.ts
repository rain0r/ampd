import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { AlbumsService } from "src/app/service/albums.service";
import { QueueService } from "src/app/service/queue.service";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { Track } from "src/app/shared/messages/incoming/track";
import { MpdAlbum } from "src/app/shared/model/http/album";
import { ClickActions } from "src/app/shared/track-table-data/click-actions.enum";
import { TrackTableOptions } from "src/app/shared/track-table-data/track-table-options";

@Component({
  selector: "app-album-dialog",
  templateUrl: "./album-dialog.component.html",
  styleUrls: ["./album-dialog.component.scss"],
})
export class AlbumDialogComponent implements OnInit {
  coverSizeClass: Observable<string>;
  isLoadingResults = true;
  trackTableData = new TrackTableOptions();
  private isMobile = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public album: MpdAlbum,
    private albumService: AlbumsService,
    private queueService: QueueService,
    private responsiveScreenService: ResponsiveScreenService
  ) {
    this.coverSizeClass = this.responsiveScreenService.getCoverCssClass();
  }

  ngOnInit(): void {
    this.responsiveScreenService
      .isMobile()
      .subscribe((isMobile) => (this.isMobile = isMobile));
    this.isLoadingResults = true;
    this.albumService
      .getAlbum(this.album.name, this.album.albumArtist)
      .subscribe((tracks) => {
        this.isLoadingResults = false;
        this.trackTableData = this.buildTrackTableOptions(tracks);
      });
  }

  onAddDir(): void {
    this.queueService.addAlbum(this.album);
  }

  onPlayDir(): void {
    this.queueService.playAlbum(this.album);
  }

  private buildTrackTableOptions(tracks: Track[]): TrackTableOptions {
    const trackTable = new TrackTableOptions();
    trackTable.addTracks(tracks);
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onPlayClick = ClickActions.AddPlayTrack;
    return trackTable;
  }

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "position", showMobile: false },
      { name: "artist-name", showMobile: true },
      { name: "album-name", showMobile: false },
      { name: "title", showMobile: true },
      { name: "length", showMobile: false },
      { name: "play-title", showMobile: false },
      { name: "add-title", showMobile: false },
    ];

    return displayedColumns
      .filter((cd) => !this.isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }
}

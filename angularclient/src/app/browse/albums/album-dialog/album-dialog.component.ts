import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { AlbumsService } from "src/app/service/albums.service";
import { QueueService } from "src/app/service/queue.service";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { MpdAlbum } from "src/app/shared/models/http/album";
import { QueueTrack } from "src/app/shared/models/queue-track";
import { ClickActions } from "src/app/shared/track-table/click-actions.enum";
import { TrackTableData } from "src/app/shared/track-table/track-table-data";

@Component({
  selector: "app-album-dialog",
  templateUrl: "./album-dialog.component.html",
  styleUrls: ["./album-dialog.component.scss"],
})
export class AlbumDialogComponent implements OnInit {
  tracks: Observable<QueueTrack[]> | null = null;
  trackTableData = new TrackTableData();
  coverSizeClass: Observable<string>;
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
    this.tracks = this.albumService.getAlbum(
      this.album.name,
      this.album.albumArtist
    );
    this.tracks.subscribe(
      (tracks) => (this.trackTableData = this.buildTableData(tracks))
    );
  }

  onAddDir(): void {
    this.queueService.addAlbum(this.album);
  }

  onPlayDir(): void {
    this.queueService.playAlbum(this.album);
  }

  private buildTableData(tracks: QueueTrack[]): TrackTableData {
    const trackTable = new TrackTableData();
    trackTable.dataSource = new MatTableDataSource<QueueTrack>(tracks);
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onPlayClick = ClickActions.AddPlayTrack;
    trackTable.pagination = true;
    return trackTable;
  }

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "position", showMobile: false },
      { name: "artistName", showMobile: true },
      { name: "albumName", showMobile: false },
      { name: "title", showMobile: true },
      { name: "length", showMobile: false },
      { name: "playTitle", showMobile: false },
      { name: "addTitle", showMobile: false },
    ];

    return displayedColumns
      .filter((cd) => !this.isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }
}

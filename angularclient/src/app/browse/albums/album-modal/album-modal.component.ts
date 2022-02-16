import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MpdAlbum } from "src/app/shared/models/http/album";
import { QueueTrack } from "src/app/shared/models/queue-track";
import { AlbumsService } from "src/app/shared/services/albums.service";
import { QueueService } from "src/app/shared/services/queue.service";
import { ResponsiveCoverSizeService } from "src/app/shared/services/responsive-cover-size.service";
import { ClickActions } from "src/app/shared/track-table/click-actions.enum";
import { TrackTableData } from "src/app/shared/track-table/track-table-data";

@Component({
  selector: "app-album-modal",
  templateUrl: "./album-modal.component.html",
  styleUrls: ["./album-modal.component.scss"],
})
export class AlbumModalComponent implements OnInit {
  tracks: Observable<QueueTrack[]> | null = null;
  trackTableData = new TrackTableData();
  coverSizeClass: Observable<string>;
  isMobile = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public album: MpdAlbum,
    private albumService: AlbumsService,
    private responsiveCoverSizeService: ResponsiveCoverSizeService,
    private queueService: QueueService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.coverSizeClass = this.responsiveCoverSizeService.getCoverCssClass();
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .pipe(map((state: BreakpointState) => state.matches))
      .subscribe((isMobile) => (this.isMobile = isMobile));
    this.tracks = this.albumService.getAlbum(
      this.album.name,
      this.album.artistName
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
    trackTable.addTitleColumn = true;
    trackTable.clickable = true;
    trackTable.dataSource = new MatTableDataSource<QueueTrack>(tracks);
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onPlayClick = ClickActions.AddPlayTrack;
    trackTable.notify = true;
    trackTable.playTitleColumn = true;
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

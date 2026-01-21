import { CdkScrollable } from "@angular/cdk/scrolling";
import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatCardImage } from "@angular/material/card";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { Observable, delay, map, of } from "rxjs";
import { AlbumsService } from "src/app/service/albums.service";
import { QueueService } from "src/app/service/queue.service";
import { Track } from "src/app/shared/messages/incoming/track";
import { MpdAlbum } from "src/app/shared/model/http/album";
import { ClickActions } from "src/app/shared/track-table-data/click-actions.enum";
import { TrackTableOptions } from "src/app/shared/track-table-data/track-table-options";
import { TrackTableDataComponent } from "../../../shared/track-table-data/track-table-data.component";

@Component({
  selector: "app-album-dialog",
  templateUrl: "./album-dialog.component.html",
  styleUrls: ["./album-dialog.component.scss"],
  imports: [
    CdkScrollable,
    MatDialogContent,
    MatProgressSpinner,
    MatCardImage,
    TrackTableDataComponent,
    MatDialogActions,
    MatButton,
    MatIcon,
    MatDialogClose,
    AsyncPipe,
  ],
})
export class AlbumDialogComponent {
  album = inject<MpdAlbum>(MAT_DIALOG_DATA);
  private albumService = inject(AlbumsService);
  private queueService = inject(QueueService);
  dialogRef = inject<MatDialogRef<AlbumDialogComponent>>(MatDialogRef);

  trackTableData$: Observable<TrackTableOptions>;
  private isMobile = false;

  constructor() {
    this.trackTableData$ = this.albumService
      .getAlbum(this.album.name, this.album.albumArtist)
      .pipe(map((tracks) => this.buildTrackTableOptions(tracks)));
  }

  onAddDir(): void {
    this.queueService.addAlbum(this.album.albumArtist, this.album.name);
    // Delay closing the dialog for a smoother trans
    of(null)
      .pipe(delay(250))
      .subscribe(() => this.dialogRef.close());
  }

  onPlayDir(): void {
    this.queueService.playAlbum(this.album.albumArtist, this.album.name);
    // Delay closing the dialog for a smoother trans
    of(null)
      .pipe(delay(250))
      .subscribe(() => this.dialogRef.close());
  }

  private buildTrackTableOptions(tracks: Track[]): TrackTableOptions {
    const trackTable = new TrackTableOptions({
      displayedColumns: this.getDisplayedColumns(),
      onPlayClick: ClickActions.AddPlayTrack,
      totalElements: tracks.length,
      showPageSizeOptions: false,
      sortable: false,
    });
    trackTable.addTracks(tracks);
    return trackTable;
  }

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "position", showMobile: false },
      { name: "artistName", showMobile: true },
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

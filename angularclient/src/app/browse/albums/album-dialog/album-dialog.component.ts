import { CdkScrollable } from "@angular/cdk/scrolling";
import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
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
import { AlbumsService } from "../../../service/albums.service";
import { QueueService } from "../../../service/queue.service";
import { Track } from "../../../shared/messages/incoming/track";
import { MpdAlbum } from "../../../shared/model/http/album";
import { ClickActions } from "../../../shared/track-table-data/click-actions.enum";
import { TrackTableDataComponent } from "../../../shared/track-table-data/track-table-data.component";
import { TrackTableOptions } from "../../../shared/track-table-data/track-table-options";

@Component({
  selector: "app-album-dialog",
  templateUrl: "./album-dialog.component.html",
  styleUrls: ["./album-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  private destroyRef = inject(DestroyRef);
  private queueService = inject(QueueService);
  dialogRef = inject<MatDialogRef<AlbumDialogComponent>>(MatDialogRef);

  trackTableData$: Observable<TrackTableOptions>;

  constructor() {
    this.trackTableData$ = this.albumService
      .getAlbum(this.album.name, this.album.albumArtist)
      .pipe(map((tracks) => this.buildTrackTableOptions(tracks)));
  }

  onAddDir(): void {
    this.queueService.addAlbum(this.album.albumArtist, this.album.name);
    // Delay closing the dialog for a smoother trans
    of(null)
      .pipe(delay(250), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.dialogRef.close());
  }

  onPlayDir(): void {
    this.queueService.playAlbum(this.album.albumArtist, this.album.name);
    // Delay closing the dialog for a smoother trans
    of(null)
      .pipe(delay(250), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.dialogRef.close());
  }

  private buildTrackTableOptions(tracks: Track[]): TrackTableOptions {
    const trackTable = new TrackTableOptions({
      onPlayClick: ClickActions.AddPlayTrack,
      totalElements: tracks.length,
      showPageSizeOptions: false,
      sortable: false,
    });
    trackTable.addTracks(tracks);
    return trackTable;
  }
}

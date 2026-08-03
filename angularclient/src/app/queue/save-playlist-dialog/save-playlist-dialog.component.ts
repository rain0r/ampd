import { CdkScrollable } from "@angular/cdk/scrolling";
import {
  Component,
  DestroyRef,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { Observable } from "rxjs";
import { NotificationService } from "../../service/notification.service";
import { PlaylistService } from "../../service/playlist.service";

@Component({
  selector: "app-save-playlist-dialog",
  templateUrl: "./save-playlist-dialog.component.html",
  styleUrls: ["./save-playlist-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class SavePlaylistDialogComponent {
  data = inject(MAT_DIALOG_DATA);

  private destroyRef = inject(DestroyRef);
  private notificationService = inject(NotificationService);
  private playlistService = inject(PlaylistService);

  dialogRef = inject<MatDialogRef<SavePlaylistDialogComponent>>(MatDialogRef);
  isDarkTheme: Observable<boolean> = new Observable<boolean>();

  onEnterPressed(): void {
    this.playlistService
      .savePlaylist(this.data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((playlist) => {
        if (playlist.success) {
          this.notificationService.popUp(
            `Saved queue as playlist '${playlist.playlistName}'`,
          );
          this.dialogRef.close();
        } else {
          this.notificationService.popUp(
            `Error saving queue as playlist '${playlist.playlistName}': ${playlist.message}`,
            true,
          );
        }
      });
  }
}

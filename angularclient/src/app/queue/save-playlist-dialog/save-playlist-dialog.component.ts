import { Component, inject } from "@angular/core";
import { Observable } from "rxjs";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from "@angular/material/dialog";
import { NotificationService } from "../../service/notification.service";
import { PlaylistService } from "../../service/playlist.service";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-save-playlist-dialog",
  templateUrl: "./save-playlist-dialog.component.html",
  styleUrls: ["./save-playlist-dialog.component.scss"],
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
  private notificationService = inject(NotificationService);
  private playlistService = inject(PlaylistService);
  dialogRef = inject<MatDialogRef<SavePlaylistDialogComponent>>(MatDialogRef);

  isDarkTheme: Observable<boolean> = new Observable<boolean>();

  onEnterPressed(): void {
    this.playlistService.savePlaylist(this.data).subscribe((playlist) => {
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

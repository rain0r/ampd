import { Component, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NotificationService } from "../../service/notification.service";
import { PlaylistService } from "../../service/playlist.service";

@Component({
  selector: "app-save-playlist-dialog",
  templateUrl: "./save-playlist-dialog.component.html",
  styleUrls: ["./save-playlist-dialog.component.scss"],
})
export class SavePlaylistDialogComponent {
  isDarkTheme: Observable<boolean> = new Observable<boolean>();

  constructor(
    public dialogRef: MatDialogRef<SavePlaylistDialogComponent>,
    private playlistService: PlaylistService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  onEnterPressed(): void {
    this.playlistService.savePlaylist(this.data).subscribe((playlist) => {
      if (playlist.success) {
        this.notificationService.popUp(
          `Saved queue as playlist '${playlist.playlistName}'`
        );
        this.dialogRef.close();
      } else {
        this.notificationService.popUp(
          `Error saving queue as playlist '${playlist.playlistName}': ${playlist.message}`,
          true
        );
      }
    });
  }
}

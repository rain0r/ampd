import { Component, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NotificationService } from "../../shared/services/notification.service";
import { MpdService } from "../../shared/services/mpd.service";

@Component({
  selector: "app-save-playlist-modal",
  templateUrl: "./save-playlist-modal.component.html",
  styleUrls: ["./save-playlist-modal.component.scss"],
})
export class SavePlaylistModalComponent {
  isDarkTheme: Observable<boolean> = new Observable<boolean>();

  constructor(
    public dialogRef: MatDialogRef<SavePlaylistModalComponent>,
    private mpdService: MpdService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  onEnterPressed(): void {
    this.mpdService.savePlaylist(this.data).subscribe((playlist) => {
      console.log(playlist);
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

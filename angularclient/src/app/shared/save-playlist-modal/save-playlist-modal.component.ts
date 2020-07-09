import { Component, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-save-playlist-modal",
  templateUrl: "./save-playlist-modal.component.html",
  styleUrls: ["./save-playlist-modal.component.scss"],
})
export class SavePlaylistModalComponent {
  isDarkTheme: Observable<boolean>;

  constructor(
    public dialogRef: MatDialogRef<SavePlaylistModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  onEnterPressed(): void {
    this.dialogRef.close(this.data);
  }
}

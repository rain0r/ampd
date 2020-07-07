import { Component, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { SettingsService } from "../services/settings.service";
import { OverlayContainer } from "@angular/cdk/overlay";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SavePlaylistData } from "./save-playlist-data";

@Component({
  selector: "app-save-playlist-modal",
  templateUrl: "./save-playlist-modal.component.html",
  styleUrls: ["./save-playlist-modal.component.scss"],
})
export class SavePlaylistModalComponent {
  isDarkTheme: Observable<boolean>;

  constructor(
    public dialogRef: MatDialogRef<SavePlaylistModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SavePlaylistData,
    private settingsService: SettingsService,
    private overlayContainer: OverlayContainer
  ) {
    this.isDarkTheme = this.settingsService.isDarkTheme();
    this.settingsService.isDarkTheme().subscribe((dark) => {
      if (dark) {
        overlayContainer.getContainerElement().classList.add("dark-theme");
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

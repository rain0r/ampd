import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { QueueTrack } from "../../shared/models/queue-track";
import { NotificationService } from "../../shared/services/notification.service";
import { MessageService } from "../../shared/services/message.service";
import { InternalMessageType } from "../../shared/messages/internal/internal-message-type.enum";
import { SettingsService } from "../../shared/services/settings.service";
import { Observable } from "rxjs";
import { BackendSettings } from "../../shared/models/backend-settings";

@Component({
  selector: "app-cover-modal",
  templateUrl: "./cover-modal.component.html",
  styleUrls: ["./cover-modal.component.scss"],
})
export class CoverModalComponent {
  backendSettings: Observable<BackendSettings>;

  constructor(
    public dialogRef: MatDialogRef<CoverModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QueueTrack,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private settingsService: SettingsService
  ) {
    this.backendSettings = this.settingsService.getBackendSettings();
  }

  onBlacklistCover(): void {
    // Save the file to the blacklist
    this.settingsService.blacklistCover(this.data.file).subscribe(
      () => {
        // Hide the cover: Trigger a cover update without a track change
        this.messageService.sendMessageType(InternalMessageType.UpdateCover);
        this.notificationService.popUp(
          `Blacklisted cover: "${this.data.title}"`
        );
      },
      () => {
        this.dialogRef.close();
      },
      () => {
        this.dialogRef.close();
      }
    );
  }
}

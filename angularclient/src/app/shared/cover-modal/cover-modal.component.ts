import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { QueueTrack } from "../models/queue-track";
import { WebSocketService } from "../services/web-socket.service";
import { NotificationService } from "../services/notification.service";
import { MpdCommands } from "../mpd/mpd-commands.enum";

@Component({
  selector: "app-cover-modal",
  templateUrl: "./cover-modal.component.html",
  styleUrls: ["./cover-modal.component.scss"],
})
export class CoverModalComponent {
  constructor(
    public dialogRef: MatDialogRef<CoverModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QueueTrack,
    private notificationService: NotificationService,
    private webSocketService: WebSocketService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onBlacklistCover(): void {
    this.webSocketService.sendData(MpdCommands.BLACKLIST_COVER, {
      file: this.data.file,
    });
    this.notificationService.popUp(`Blacklisted cover: "${this.data.title}"`);
  }
}

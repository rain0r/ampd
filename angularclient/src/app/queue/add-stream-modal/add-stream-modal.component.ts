import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NotificationService } from "../../shared/services/notification.service";
import { QueueService } from "../../shared/services/queue.service";

@Component({
  selector: "app-add-stream-modal",
  templateUrl: "./add-stream-modal.component.html",
  styleUrls: ["./add-stream-modal.component.scss"],
})
export class AddStreamModalComponent {
  constructor(
    public dialogRef: MatDialogRef<AddStreamModalComponent>,
    private notificationService: NotificationService,
    private queueService: QueueService,
    @Inject(MAT_DIALOG_DATA) public streamUrl: string
  ) {}

  onEnterPressed(): void {
    this.queueService.addTrack(this.streamUrl);
    this.dialogRef.close();
  }
}

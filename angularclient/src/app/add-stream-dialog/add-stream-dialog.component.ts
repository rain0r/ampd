import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { QueueService } from "../service/queue.service";

@Component({
  selector: "app-add-stream-dialog",
  templateUrl: "./add-stream-dialog.component.html",
  styleUrls: ["./add-stream-dialog.component.scss"],
})
export class AddStreamDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddStreamDialogComponent>,
    private queueService: QueueService,
    @Inject(MAT_DIALOG_DATA) public streamUrl: string
  ) {}

  onEnterPressed(): void {
    this.queueService.addTrack(this.streamUrl);
    this.dialogRef.close();
  }
}

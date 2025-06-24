import { Component, inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from "@angular/material/dialog";
import { QueueService } from "../../../service/queue.service";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-add-stream-dialog",
  templateUrl: "./add-stream-dialog.component.html",
  styleUrls: ["./add-stream-dialog.component.scss"],
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
export class AddStreamDialogComponent {
  dialogRef = inject<MatDialogRef<AddStreamDialogComponent>>(MatDialogRef);
  private queueService = inject(QueueService);
  streamUrl = inject(MAT_DIALOG_DATA);

  onEnterPressed(): void {
    this.queueService.addTrack(this.streamUrl);
    this.dialogRef.close();
  }
}

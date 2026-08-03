import {
  AfterViewInit,
  Component,
  DestroyRef,
  Input,
  ViewChild,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from "@angular/material/table";
import { RadioStream } from "../../../shared/model/db/radio-stream";
import { ConfirmDeleteStreamDialogComponent } from "../confirm-delete-stream-dialog/confirm-delete-stream-dialog.component";

import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardTitle,
} from "@angular/material/card";
import { MatFormField, MatSuffix } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { QueueService } from "../../../service/queue.service";
import { RadioStreamService } from "../../../service/radio-stream.service";

@Component({
  selector: "app-radio-stream-list",
  templateUrl: "./radio-stream-list.component.html",
  styleUrls: ["./radio-stream-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatFormField,
    MatInput,
    FormsModule,
    MatIcon,
    MatSuffix,
    MatButton,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatNoDataRow,
    MatPaginator,
  ],
})
export class RadioStreamListComponent implements AfterViewInit {
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private queueService = inject(QueueService);
  private radioStreamService = inject(RadioStreamService);

  @Input() dataSource = new MatTableDataSource<RadioStream>();

  displayedColumns: string[] = [
    "name",
    "url",
    "deleteStream",
    "addStream",
    "playStream",
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onPlayStream(stream: RadioStream): void {
    this.queueService.addPlayTrack(stream.url);
  }

  onAddStream(stream: RadioStream): void {
    this.queueService.addTrackFile(stream.url);
  }

  onConfirmDeleteStream(stream: RadioStream): void {
    const dialogRef = this.dialog.open(ConfirmDeleteStreamDialogComponent, {
      data: stream.name,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result === true) {
          this.radioStreamService
            .deleteStream(stream.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => (this.dataSource.data = data));
        }
      });
  }

  onAddAll(): void {
    const streams = this.dataSource.data.map((rs) => rs.url);
    this.queueService.addTrackFiles(streams);
  }

  applyFilter(eventTarget: EventTarget | null): void {
    if (!eventTarget) {
      return;
    }
    const filterValue = (eventTarget as HTMLInputElement).value;
    this.dataSource.filter = filterValue.toLowerCase();
  }

  resetFilter(): void {
    this.dataSource.filter = "";
  }
}

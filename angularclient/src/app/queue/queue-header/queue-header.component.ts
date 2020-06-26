import { HttpClient } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs/index";
import { CoverModalComponent } from "../../shared/cover-modal/cover-modal.component";
import { MessageService } from "../../shared/services/message.service";
import { ResponsiveCoverSizeService } from "../../shared/services/responsive-cover-size.service";
import { QueueTrack } from "../../shared/models/queue-track";

@Component({
  selector: "app-queue-header",
  templateUrl: "./queue-header.component.html",
  styleUrls: ["./queue-header.component.scss"],
})
export class QueueHeaderComponent {
  @Input() currentSong!: QueueTrack;
  @Input() currentState!: string;
  coverSizeClass: Observable<string>;

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private messageService: MessageService,
    private responsiveCoverSizeService: ResponsiveCoverSizeService
  ) {
    this.coverSizeClass = responsiveCoverSizeService.getCoverCssClass();
  }

  openCoverModal(): void {
    this.dialog.open(CoverModalComponent, {
      data: { coverUrl: this.currentSong.coverUrl },
    });
  }
}

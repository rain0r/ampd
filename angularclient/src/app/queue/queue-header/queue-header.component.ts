import { HttpClient } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs/index";
import { CoverModalComponent } from "../../shared/cover-modal/cover-modal.component";
import { MessageService } from "../../shared/services/message.service";
import { ResponsiveCoverSizeService } from "../../shared/services/responsive-cover-size.service";
import { QueueTrack } from "../../shared/models/queue-track";
import { filter } from "rxjs/operators";
import { InternalMessageType } from "../../shared/messages/internal/internal-message-type.enum";

@Component({
  selector: "app-queue-header",
  templateUrl: "./queue-header.component.html",
  styleUrls: ["./queue-header.component.scss"],
})
export class QueueHeaderComponent {
  @Input() currentSong!: QueueTrack;
  @Input() currentState!: string;
  coverSizeClass: Observable<string>;
  hasCover = false;

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private messageService: MessageService,
    private responsiveCoverSizeService: ResponsiveCoverSizeService
  ) {
    this.coverSizeClass = responsiveCoverSizeService.getCoverCssClass();
    this.messageService
      .getMessage()
      .pipe(filter((msg) => msg.type === InternalMessageType.UpdateCover))
      .subscribe(() => this.checkCoverUrl());
  }

  openCoverModal(): void {
    this.dialog.open(CoverModalComponent, {
      data: { coverUrl: this.currentSong.coverUrl },
    });
  }

  private checkCoverUrl(): void {
    const obs = {
      error: () => (this.hasCover = true), // TODO
      complete: () => (this.hasCover = true),
    };
    this.http.head(this.currentSong.coverUrl).subscribe(obs);
  }
}

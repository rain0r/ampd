import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs/index';
import { InternalCommands } from '../../shared/commands/internal';
import { CoverModalComponent } from '../../shared/cover-modal/cover-modal.component';
import { QueueTrack } from '../../shared/models/queue-track';
import { MessageService } from '../../shared/services/message.service';

@Component({
  selector: 'app-queue-header',
  templateUrl: './queue-header.component.html',
  styleUrls: ['./queue-header.component.scss'],
})
export class QueueHeaderComponent {
  @Input() public currentSong: QueueTrack = new QueueTrack();
  @Input() public currentState: string = '';
  private hasCover = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message.text === InternalCommands.UPDATE_COVER) {
        this.checkCoverUrl();
      }
    });
  }

  public openCoverModal(): void {
    this.dialog.open(CoverModalComponent, {
      data: { coverUrl: this.currentSong.coverUrl() },
    });
  }

  private checkCoverUrl() {
    const obs = {
      error: err => (this.hasCover = false),
      complete: () => (this.hasCover = true),
    };

    this.http.head(this.currentSong.coverUrl()).subscribe(obs);
  }
}

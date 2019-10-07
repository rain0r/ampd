import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CoverModalComponent } from '../../shared/cover-modal/cover-modal.component';
import { QueueTrack } from '../../shared/models/queue-track';

@Component({
  selector: 'app-queue-header',
  templateUrl: './queue-header.component.html',
  styleUrls: ['./queue-header.component.css'],
})
export class QueueHeaderComponent {
  @Input() public currentSong: QueueTrack = new QueueTrack();
  @Input() public currentState: string = '';

  constructor(public dialog: MatDialog) {}

  public openCoverModal(): void {
    const dialogRef = this.dialog.open(CoverModalComponent, {
      data: { coverUrl: this.currentSong.coverUrl() },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

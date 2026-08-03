import {
  Component,
  DestroyRef,
  Input,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButton } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { delay, of } from "rxjs";
import { ControlPanelService } from "../../../service/control-panel.service";
import { NotificationService } from "../../../service/notification.service";
import { QueueService } from "../../../service/queue.service";
import { Playlist } from "../../../shared/messages/incoming/playlist";
import { PlaylistInfoDialogComponent } from "../playlist-info-dialog/playlist-info-dialog.component";

@Component({
  selector: "app-playlist-entry",
  templateUrl: "./playlist-entry.component.html",
  styleUrls: ["./playlist-entry.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIcon, MatButton],
})
export class PlaylistEntryComponent {
  private controlPanelService = inject(ControlPanelService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);
  private queueService = inject(QueueService);

  @Input() playlist: Playlist = {} as Playlist;

  onPlaylistInfo($event: MouseEvent, playlist: Playlist): void {
    $event.stopPropagation();
    this.dialog.open(PlaylistInfoDialogComponent, {
      data: playlist,
    });
  }

  onPlayDir($event: MouseEvent, playlistName: string): void {
    $event.stopPropagation();
    this.queueService.addPlaylist(playlistName);
    of(null)
      .pipe(delay(500), takeUntilDestroyed(this.destroyRef))
      .subscribe(
        // Delay hitting "play" since the tracks might not yet been to the queue
        () => this.controlPanelService.play(),
      );
    this.notificationService.popUp(`Playing playlist: "${playlistName}"`);
  }

  onAddDir($event: MouseEvent, playlistName: string): void {
    $event.stopPropagation();
    this.queueService.addPlaylist(playlistName);
    this.notificationService.popUp(`Playing playlist: "${playlistName}"`);
  }
}

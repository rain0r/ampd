import { Injectable, inject } from "@angular/core";
import objectHash from "object-hash";
import { Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { Track } from "../shared/messages/incoming/track";
import { QueueTrack } from "../shared/model/queue-track";
import { PaginatedResponse } from "./../shared/messages/incoming/paginated-response";
import { AmpdRxStompService } from "./ampd-rx-stomp.service";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class QueueService {
  private rxStompService = inject(AmpdRxStompService);
  private notificationService = inject(NotificationService);

  queue$: Observable<PaginatedResponse<Track>>;

  private queuePath = "/app/queue/";

  constructor() {
    this.queue$ = this.getQueueSubscription$();
  }

  getPage(pageIndex: number, pageSize: number): void {
    this.rxStompService.publish({
      destination: `${this.queuePath}page`,
      body: JSON.stringify({
        pageIndex: pageIndex,
        pageSize: pageSize,
      }),
    });
  }

  clearQueue(): void {
    this.rxStompService.publish({
      destination: `${this.queuePath}clear`,
    });

    this.notificationService.popUp("Cleared queue");
  }

  addDir(dir: string): void {
    this.rxStompService.publish({
      destination: `${this.queuePath}add-dir`,
      body: decodeURIComponent(dir),
    });
  }

  addAlbum(albumArtist: string, name: string): void {
    this.rxStompService.publish({
      destination: `${this.queuePath}add-album`,
      body: JSON.stringify({ albumArtist: albumArtist, name: name }),
    });

    this.notificationService.popUp(`Added album: ${albumArtist} — ${name}`);
  }

  playAlbum(albumArtist: string, name: string): void {
    this.rxStompService.publish({
      destination: `${this.queuePath}play-album`,
      body: JSON.stringify({ albumArtist: albumArtist, name: name }),
    });

    this.notificationService.popUp(`Playing album: ${albumArtist} — ${name}`);
  }

  addPlayQueueTrack(track: QueueTrack): void {
    this.addPlayTrack(track.file);
    this.notificationService.popUp(
      `Playing: ${track.title ? track.title : track.file}`,
    );
  }

  playQueueTrack(track: QueueTrack): void {
    this.playTrack(track.file);
    this.notificationService.popUp(
      `Playing: ${track.title ? track.title : track.file}`,
    );
  }

  addQueueTrack(track: QueueTrack): void {
    this.addTrackFile(track.file, false);
    this.notificationService.popUp(
      `Added: ${track.title ? track.title : track.file}`,
    );
  }

  addTrackFile(file: string, withPopUp = false): void {
    this.addTrackFiles([file], withPopUp);
  }

  addTrackFiles(filePaths: string[], withPopUp = false): void {
    this.rxStompService.publish({
      destination: `${this.queuePath}add-tracks`,
      body: JSON.stringify(filePaths),
    });
    if (withPopUp) {
      this.notificationService.popUp(`Added ${filePaths.length} tracks`);
    }
  }

  addPlaylist(playlistName: string): void {
    this.rxStompService.publish({
      destination: `${this.queuePath}add-playlist`,
      body: playlistName,
    });
  }

  addPlayTrack(file: string): void {
    this.rxStompService.publish({
      destination: `${this.queuePath}add-play-track`,
      body: file,
    });
  }

  removeTrack(position: number): void {
    this.rxStompService.publish({
      destination: `${this.queuePath}remove-track`,
      body: JSON.stringify(position),
    });
  }

  playTrack(file: string): void {
    this.rxStompService.publish({
      destination: `${this.queuePath}play-track`,
      body: file,
    });
  }

  moveTrack(oldPos: number, newPos: number): void {
    this.rxStompService.publish({
      destination: `${this.queuePath}move-track`,
      body: JSON.stringify({
        oldPos: oldPos,
        newPos: newPos,
      }),
    });
  }

  private getQueueSubscription$(): Observable<PaginatedResponse<Track>> {
    return this.rxStompService.watch("/user/topic/queue").pipe(
      map((message) => message.body),
      map((body) => JSON.parse(body) as PaginatedResponse<Track>),
      distinctUntilChanged(
        (prev, curr) =>
          objectHash(prev, { algorithm: "md5" }) ===
          objectHash(curr, { algorithm: "md5" }),
      ),
    );
  }
}

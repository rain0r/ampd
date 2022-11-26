import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { MpdAlbum } from "../shared/model/http/album";
import { QueueTrack } from "../shared/model/queue-track";
import { QueueResponse } from "./../shared/messages/incoming/queue-response";
import { AmpdRxStompService } from "./ampd-rx-stomp.service";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class QueueService {
  private path = "/app/queue/";

  constructor(
    private rxStompService: AmpdRxStompService,
    private notificationService: NotificationService
  ) {}

  /**
   * Don't wait for the next publisher message from the server: manually request the queue.
   */
  getQueue(): void {
    this.rxStompService.publish({
      destination: this.path,
    });
  }

  getPage(pageIndex: number, pageSize: number): void {
    this.rxStompService.publish({
      destination: `${this.path}page`,
      body: JSON.stringify({
        pageIndex: pageIndex,
        pageSize: pageSize,
      }),
    });
  }

  clearQueue(): void {
    this.rxStompService.publish({
      destination: `${this.path}clear`,
    });
    this.getQueue();
    this.notificationService.popUp("Cleared queue");
  }

  addDir(dir: string): void {
    this.rxStompService.publish({
      destination: `${this.path}add-dir`,
      body: decodeURIComponent(dir),
    });
    this.getQueue();
  }

  addAlbum(album: MpdAlbum): void {
    this.rxStompService.publish({
      destination: `${this.path}add-album`,
      body: JSON.stringify(album),
    });
    this.getQueue();
  }

  playAlbum(album: MpdAlbum): void {
    this.rxStompService.publish({
      destination: `${this.path}play-album`,
      body: JSON.stringify(album),
    });
    this.getQueue();
  }

  addPlayQueueTrack(track: QueueTrack): void {
    this.addPlayTrack(track.file);
    this.notificationService.popUp(
      `Playing: ${track.title ? track.title : track.file}`
    );
  }

  playQueueTrack(track: QueueTrack): void {
    this.playTrack(track.file);
    this.notificationService.popUp(
      `Playing: ${track.title ? track.title : track.file}`
    );
  }

  addQueueTrack(track: QueueTrack): void {
    this.addTrack(track.file);
    this.notificationService.popUp(
      `Added: ${track.title ? track.title : track.file}`
    );
  }

  addTrack(file: string): void {
    this.addTracks([file]);
  }

  addTracks(filePaths: string[]): void {
    this.rxStompService.publish({
      destination: `${this.path}add-tracks`,
      body: JSON.stringify(filePaths),
    });
    this.getQueue();
    this.notificationService.popUp(`Added ${filePaths.length} tracks`);
  }

  addPlaylist(playlistName: string): void {
    this.rxStompService.publish({
      destination: `${this.path}add-playlist`,
      body: playlistName,
    });
    this.getQueue();
  }

  addPlayTrack(file: string): void {
    this.rxStompService.publish({
      destination: `${this.path}add-play-track`,
      body: file,
    });
    this.getQueue();
  }

  removeTrack(position: number): void {
    this.rxStompService.publish({
      destination: `${this.path}remove-track`,
      body: JSON.stringify(position),
    });
    this.getQueue();
  }

  playTrack(file: string): void {
    this.rxStompService.publish({
      destination: `${this.path}play-track`,
      body: file,
    });
  }

  moveTrack(oldPos: number, newPos: number): void {
    this.rxStompService.publish({
      destination: `${this.path}move-track`,
      body: JSON.stringify({
        oldPos: oldPos,
        newPos: newPos,
      }),
    });
    this.getQueue();
  }

  getQueueSubscription(): Observable<QueueResponse> {
    return this.rxStompService.watch("/topic/queue").pipe(
      map((message) => message.body),
      map((body) => <QueueResponse>JSON.parse(body)),
      distinctUntilChanged((prev, curr) => {
        return (
          prev.content.length == curr.content.length &&
          JSON.stringify(curr) === JSON.stringify(prev)
        );
      })
    );
  }
}

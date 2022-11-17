import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { Track } from "../shared/messages/incoming/track";
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

  getQueue(): void {
    this.rxStompService.publish({
      destination: this.path,
    });
  }

  clearQueue(): void {
    this.removeAll();
    this.notificationService.popUp("Cleared queue");
    this.getQueue();
  }

  addDir(dir: string): void {
    this.rxStompService.publish({
      destination: `${this.path}add-dir`,
      body: decodeURIComponent(dir),
    });
  }

  addAlbum(album: MpdAlbum): void {
    this.rxStompService.publish({
      destination: `${this.path}add-album`,
      body: JSON.stringify(album),
    });
  }

  playAlbum(album: MpdAlbum): void {
    this.rxStompService.publish({
      destination: `${this.path}play-album`,
      body: JSON.stringify(album),
    });
  }

  addPlayQueueTrack(track: QueueTrack): void {
    this.addPlayTrack(track.file);
    this.notificationService.popUp(`Playing: ${track.title}`);
  }

  playQueueTrack(track: QueueTrack): void {
    this.playTrack(track.file);
    this.notificationService.popUp(`Playing: ${track.title}`);
  }

  addQueueTrack(track: QueueTrack): void {
    this.addTrack(track.file);
    this.notificationService.popUp(`Added: ${track.title}`);
  }

  addTrack(file: string): void {
    this.addTracks([file]);
  }

  addTracks(filePaths: string[]): void {
    this.rxStompService.publish({
      destination: `${this.path}add-tracks`,
      body: JSON.stringify(filePaths),
    });
  }

  addPlaylist(playlistName: string): void {
    this.rxStompService.publish({
      destination: `${this.path}add-playlist`,
      body: playlistName,
    });
  }

  addPlayTrack(file: string): void {
    this.rxStompService.publish({
      destination: `${this.path}add-play-track`,
      body: file,
    });
  }

  removeTrack(position: number): void {
    this.rxStompService.publish({
      destination: `${this.path}remove-track`,
      body: JSON.stringify(position),
    });
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
  }

  getQueueSubscription(): Observable<Track[]> {
    return this.rxStompService.watch("/topic/queue").pipe(
      map((message) => message.body),
      map((body) => <QueueResponse>JSON.parse(body)),
      map((data) => data.content),
      distinctUntilChanged((prev, curr) => {
        return (
          prev.length == curr.length &&
          JSON.stringify(curr) === JSON.stringify(prev)
        );
      })
    );
  }

  private removeAll(): void {
    this.rxStompService.publish({
      destination: `${this.path}clear`,
    });
  }
}

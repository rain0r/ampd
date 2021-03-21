import { Injectable } from "@angular/core";
import { RxStompService } from "@stomp/ng2-stompjs";
import { Observable } from "rxjs";
import { Track } from "../messages/incoming/track";
import { distinctUntilChanged, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class QueueService {
  private path = "/app/queue/";

  constructor(private rxStompService: RxStompService) {}

  getQueue(): void {
    this.rxStompService.publish({
      destination: this.path,
    });
  }

  clearQueue(): void {
    this.removeAll();
    this.getQueue();
  }

  addDir(dir: string): void {
    this.rxStompService.publish({
      destination: `${this.path}add-dir`,
      body: dir,
    });
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

  getQueueSubscription(): Observable<Track[]> {
    return this.rxStompService.watch("/topic/queue").pipe(
      map((message) => message.body),
      map((body) => <Track[]>JSON.parse(body)),
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

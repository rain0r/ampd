import { Injectable } from "@angular/core";
import { RxStompService } from "@stomp/ng2-stompjs";

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

  removeAll(): void {
    this.rxStompService.publish({
      destination: `${this.path}clear`,
    });
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
      destination: `${this.path}add-playist`,
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
}

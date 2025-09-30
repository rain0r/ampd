import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import {
  AmpdBrowsePayload,
  BrowsePayload,
} from "../shared/model/browse-payload";
import { QueueTrack } from "../shared/model/queue-track";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class BrowseService {
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);

  isLoading = signal(true);

  sendBrowseReq(path: string): Observable<AmpdBrowsePayload> {
    const url = `${this.settingsService.getBackendContextAddr()}api/browse?path=${path}`;
    this.isLoading.set(true);
    return this.http.get<BrowsePayload>(url).pipe(
      map((payload) => this.convertPayload(payload)),
      tap(() => this.isLoading.set(false)),
    );
  }

  private convertPayload(payload: BrowsePayload): AmpdBrowsePayload {
    return {
      directories: payload.directories.map((dir) => {
        dir.albumCoverUrl = this.getAlbumCoverUrl(dir.path);
        dir.displayedPath = this.getDisplayedPath(dir.path);
        return dir;
      }),
      playlists: payload.playlists,
      queueTracks: payload.tracks.map(
        (track, index) => new QueueTrack(track, index),
      ),
      dirParam: payload.dirParam,
      isTracksOnlyDir: this.isTracksOnlyDir(payload),
      dirUp: this.buildDirUp(payload.dirParam),
    } as AmpdBrowsePayload;
  }

  private getAlbumCoverUrl(path: string): string {
    return `${this.settingsService.getFindDirCoverUrl()}?path=${encodeURIComponent(
      path,
    )}`;
  }

  private getDisplayedPath(path: string): string {
    return path.trim().split("/").pop() || "";
  }

  private isTracksOnlyDir(payload: BrowsePayload): boolean {
    return (
      payload.playlists.length === 0 &&
      payload.directories.length === 0 &&
      payload.tracks.length > 0
    );
  }

  private buildDirUp(dir: string): string {
    const splitted = decodeURIComponent(dir).split("/");
    splitted.pop();
    let targetDir = splitted.join("/");
    if (targetDir.length === 0) {
      targetDir = "/";
    }
    return encodeURIComponent(targetDir);
  }
}

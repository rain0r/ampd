import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AmpdBrowsePayload } from "../shared/model/ampd-browse-payload";
import { BrowsePayload } from "../shared/model/browse-payload";
import { QueueTrack } from "../shared/model/queue-track";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class BrowseService {
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);

  buildEmptyPayload(): AmpdBrowsePayload {
    return {
      directories: [],
      playlists: [],
      tracks: [],
    } as AmpdBrowsePayload;
  }

  sendBrowseReq(path: string): Observable<AmpdBrowsePayload> {
    const url = `${this.settingsService.getBackendContextAddr()}api/browse?path=${path}`;
    return this.http
      .get<BrowsePayload>(url)
      .pipe(map((payload) => this.convertPayload(payload)));
  }

  private convertPayload(payload: BrowsePayload): AmpdBrowsePayload {
    return {
      directories: payload.directories.map((dir) => {
        dir.albumCoverUrl = this.getAlbumCoverUrl(dir.path);
        dir.displayedPath = this.getDisplayedPath(dir.path);
        return dir;
      }),
      playlists: payload.playlists,
      tracks: payload.tracks.map(
        (track, index) => new QueueTrack(track, index),
      ),
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
}

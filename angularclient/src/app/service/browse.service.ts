import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ErrorMsg } from "../shared/error/error-msg";
import { AmpdBrowsePayload } from "../shared/models/ampd-browse-payload";
import { BrowsePayload } from "../shared/models/browse-payload";
import { QueueTrack } from "../shared/models/queue-track";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class BrowseService {
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  buildEmptyPayload(): AmpdBrowsePayload {
    return {
      directories: [],
      playlists: [],
      tracks: [],
    } as AmpdBrowsePayload;
  }

  sendBrowseReq(path: string): Observable<AmpdBrowsePayload> {
    const url = `${this.settingsService.getBackendContextAddr()}api/browse?path=${path}`;
    return this.http.get<BrowsePayload>(url).pipe(
      catchError((err: HttpErrorResponse) =>
        throwError(() => {
          return {
            title: `Got an error while browsing ${path}:`,
            detail: err.message,
          } as ErrorMsg;
        })
      ),
      map((payload) => this.convertPayload(payload))
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
      tracks: payload.tracks.map(
        (track, index) => new QueueTrack(track, index)
      ),
    } as AmpdBrowsePayload;
  }

  private getAlbumCoverUrl(path: string): string {
    return `${this.settingsService.getFindDirCoverUrl()}?path=${encodeURIComponent(
      path
    )}`;
  }

  private getDisplayedPath(path: string): string {
    return path.trim().split("/").pop() || "";
  }
}

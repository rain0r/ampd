import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { SettingsService } from "./settings.service";
import { Observable, throwError } from "rxjs";
import { BrowsePayload } from "../models/browse-payload";
import { AmpdBrowsePayload } from "../models/ampd-browse-payload";
import { catchError, map } from "rxjs/operators";
import { QueueTrack } from "../models/queue-track";
import { ErrorMsg } from "../error/error-msg";

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
    return this.http
      .get<BrowsePayload>(
        this.settingsService.getBrowseUrl(encodeURIComponent(path))
      )
      .pipe(
        catchError((err: HttpErrorResponse) =>
          throwError({
            title: `Got an error while browsing ${path}:`,
            detail: err.message,
          } as ErrorMsg)
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

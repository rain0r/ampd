import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "./settings.service";
import { Observable, throwError } from "rxjs";
import { BrowsePayload } from "../models/browse-payload";
import { AmpdBrowsePayload } from "../models/ampd-browse-payload";
import { catchError, map } from "rxjs/operators";
import { QueueTrack } from "../models/queue-track";

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
      .get<BrowsePayload>(this.settingsService.getBrowseUrl(path))
      .pipe(
        catchError((err) => throwError(err)),
        map((payload) => this.convertPayload(payload))
      );
  }

  private convertPayload(payload: BrowsePayload): AmpdBrowsePayload {
    const ret = {
      directories: payload.directories,
      playlists: payload.playlists,
      tracks: [],
    } as AmpdBrowsePayload;

    payload.tracks.forEach((track, index) => {
      track.position = index;
      return new QueueTrack(track);
    });
    return ret;
  }
}

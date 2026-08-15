import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, Subject } from "rxjs";
import { PlaylistSaved } from "../shared/messages/incoming/playlist-saved";
import { SavePlaylistResponse } from "../shared/messages/incoming/save-playlist-response";
import { PlaylistInfo } from "../shared/model/playlist-info";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class PlaylistService {
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);

  playlistSaved: Observable<PlaylistSaved>;

  private playlistSaved$ = new Subject<PlaylistSaved>();

  constructor() {
    this.playlistSaved = this.playlistSaved$.asObservable();
  }

  getPlaylistInfo(
    playlistName: string,
    pageIndex: number | null,
    pageSize: number | null,
  ): Observable<PlaylistInfo> {
    let params = new HttpParams();
    if (pageIndex) {
      params = params.append("pageIndex", encodeURIComponent(pageIndex));
    }
    if (pageSize) {
      params = params.append("pageSize", encodeURIComponent(pageSize));
    }
    const url = `${this.settingsService.getPlaylistRootUrl()}${playlistName}`;
    return this.http.get<PlaylistInfo>(url, { params: params }).pipe(
      catchError((err) => {
        throw `Failed to fetch playlist info for playlist=${playlistName}: ${err.statusText}`;
      }),
    );
  }

  savePlaylist(name: string): Observable<SavePlaylistResponse> {
    return this.http
      .post<SavePlaylistResponse>(
        this.settingsService.getPlaylistRootUrl(),
        name,
      )
      .pipe(
        catchError((err) => {
          throw `Failed to save playlist with name=${name}: ${err.statusText}`;
        }),
      );
  }

  deletePlaylist(name: string): Observable<unknown> {
    const url = `${this.settingsService.getPlaylistRootUrl()}${name}`;
    return this.http.delete(url).pipe(
      catchError((err) => {
        throw `Failed to delete playlist with name=${name}: ${err.statusText}`;
      }),
    );
  }
}

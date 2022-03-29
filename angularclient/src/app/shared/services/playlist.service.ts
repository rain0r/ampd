import { Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { PlaylistSaved } from "../messages/incoming/playlist-saved";
import { PlaylistInfo } from "../models/playlist-info";
import { SavePlaylistResponse } from "../models/http/savePlaylistResponse";
import { catchError } from "rxjs/operators";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ErrorMsg } from "../error/error-msg";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class PlaylistService {
  playlistSaved: Observable<PlaylistSaved>;
  private playlistSaved$ = new Subject<PlaylistSaved>();

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    this.playlistSaved = this.playlistSaved$.asObservable();
  }

  getPlaylistInfo(playlistName: string): Observable<PlaylistInfo> {
    const url = `${this.settingsService.getPlaylistRootUrl()}${playlistName}`;
    return this.http.get<PlaylistInfo>(url);
  }

  savePlaylist(playlistName: string): Observable<SavePlaylistResponse> {
    return this.http.post<SavePlaylistResponse>(
      this.settingsService.getPlaylistRootUrl(),
      playlistName
    );
  }

  deletePlaylist(name: string): Observable<unknown> {
    const url = `${this.settingsService.getPlaylistRootUrl()}${name}`;
    return this.http.delete(url).pipe(
      catchError((err: HttpErrorResponse) =>
        throwError(() => {
          return {
            title: `Got an error deleteting playlist: ${name}:`,
            detail: err.message,
          } as ErrorMsg;
        })
      )
    );
  }
}

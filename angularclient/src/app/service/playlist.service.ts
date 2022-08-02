import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { PlaylistSaved } from "../shared/messages/incoming/playlist-saved";
import { SavePlaylistResponse } from "../shared/models/http/savePlaylistResponse";
import { PlaylistInfo } from "../shared/models/playlist-info";
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
    return this.http.delete(url);
  }
}

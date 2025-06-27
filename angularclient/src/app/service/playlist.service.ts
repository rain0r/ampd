import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, Subject } from "rxjs";
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
    return this.http.get<PlaylistInfo>(url, { params: params });
  }

  savePlaylist(playlistName: string): Observable<SavePlaylistResponse> {
    return this.http.post<SavePlaylistResponse>(
      this.settingsService.getPlaylistRootUrl(),
      playlistName,
    );
  }

  deletePlaylist(name: string): Observable<unknown> {
    const url = `${this.settingsService.getPlaylistRootUrl()}${name}`;
    return this.http.delete(url);
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Track } from "../shared/messages/incoming/track";
import { MpdAlbum } from "../shared/model/http/album";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class RecentlyListenedService {
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService,
  ) {}

  getAlbums(): Observable<MpdAlbum[]> {
    const url = `${this.settingsService.getBackendContextAddr()}api/browse/recently-listened/albums`;
    return this.http.get<MpdAlbum[]>(url).pipe(
      map((albums) => {
        albums.map((album) => {
          album.albumCoverUrl = `${this.settingsService.getBackendContextAddr()}api/find-album-cover?albumName=${encodeURIComponent(
            album.name,
          )}&artistName=${encodeURIComponent(album.albumArtist)}`;
          return album;
        });
        return albums;
      }),
    );
  }

  getTracks(): Observable<Track[]> {
    const url = `${this.settingsService.getBackendContextAddr()}api/browse/recently-listened/tracks`;
    return this.http.get<Track[]>(url);
  }
}

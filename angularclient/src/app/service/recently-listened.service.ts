import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
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

  getAlbums() {
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
}

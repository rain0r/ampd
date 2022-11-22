import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MpdAlbum } from "../shared/model/http/album";
import { QueueTrack } from "../shared/model/queue-track";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class AlbumsService {
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  /**
   * Fetch albums from the backend.
   *
   * @param page
   * @returns
   */
  getAlbums(page = 1, searchTerm = "", sortBy = ""): Observable<MpdAlbum[]> {
    const url = `${this.settingsService.getBackendContextAddr()}api/albums/?page=${page}&searchTerm=${searchTerm}&sortBy=${encodeURIComponent(
      sortBy
    )}`;
    return this.http.get<MpdAlbum[]>(url).pipe(
      map((albums) => {
        return albums.map((album) => {
          album.albumCoverUrl = `${this.settingsService.getBackendContextAddr()}api/find-album-cover?albumName=${encodeURIComponent(
            album.name
          )}&artistName=${encodeURIComponent(album.albumArtist)}`;
          return album;
        });
      })
    );
  }

  /**
   * Fetch the tracks of an album from the backend.
   *
   * @param name Album name
   * @param artistName Artist name
   * @returns
   */
  getAlbum(name: string, artistName: string): Observable<QueueTrack[]> {
    const url = `${this.settingsService.getBackendContextAddr()}api/album/?name=${encodeURIComponent(
      name
    )}&artistName=${encodeURIComponent(artistName)}`;
    return this.http.get<QueueTrack[]>(url);
  }
}

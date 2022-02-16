import { HttpClient, HttpUrlEncodingCodec } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MpdAlbum } from "../models/http/album";
import { QueueTrack } from "../models/queue-track";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class AlbumsService {
  private encoder = new HttpUrlEncodingCodec();

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  /**
   * Fetch albums from the backensed.
   *
   * @param page
   * @returns
   */
  getAlbums(page: number): Observable<MpdAlbum[]> {
    const url = `${this.settingsService.getBackendContextAddr()}api/albums/?page=${page}`;
    return this.http.get<MpdAlbum[]>(url).pipe(
      map((albums) => {
        return albums.map((album) => {
          album.albumCoverUrl = `${this.settingsService.getBackendContextAddr()}api/find-album-cover?albumName=${this.encoder.encodeKey(
            album.name
          )}&artistName=${this.encoder.encodeKey(album.artistName)}`;
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
    name = this.encoder.encodeValue(name);
    artistName = this.encoder.encodeValue(artistName);
    const url = `${this.settingsService.getBackendContextAddr()}api/album/?name=${name}&artistName=${artistName}`;
    return this.http.get<QueueTrack[]>(url).pipe(
      map((tracks) => {
        return tracks.map((track, index) => new QueueTrack(track, index));
      })
    );
  }
}

import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PaginatedResponse } from "src/app/shared/messages/incoming/paginated-response";
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
  getAlbums(
    searchTerm: string | null,
    pageIndex: number | null,
    sortBy: string | null
  ): Observable<PaginatedResponse<MpdAlbum>> {
    let params = new HttpParams();
    if (!!pageIndex) {
      params = params.append("pageIndex", pageIndex);
    }
    if (!!searchTerm) {
      params = params.append("searchTerm", searchTerm);
    }
    if (!!sortBy) {
      params = params.append("sortBy", sortBy);
    }
    const url = `${this.settingsService.getBackendContextAddr()}api/albums`;
    return this.http
      .get<PaginatedResponse<MpdAlbum>>(url, { params: params })
      .pipe(
        map((albums) => {
          albums.content.map((album) => {
            album.albumCoverUrl = `${this.settingsService.getBackendContextAddr()}api/find-album-cover?albumName=${encodeURIComponent(
              album.name
            )}&artistName=${encodeURIComponent(album.albumArtist)}`;
            return album;
          });
          return albums;
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

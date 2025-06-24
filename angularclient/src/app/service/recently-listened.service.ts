import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";
import { PaginatedResponse } from "../shared/messages/incoming/paginated-response";
import { Track } from "../shared/messages/incoming/track";
import { MpdAlbum } from "../shared/model/http/album";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class RecentlyListenedService {
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);

  getAlbums(pageIndex: number | null): Observable<PaginatedResponse<MpdAlbum>> {
    let params = new HttpParams();
    if (pageIndex) {
      params = params.append("pageIndex", pageIndex);
    }

    const url = `${this.settingsService.getBackendContextAddr()}api/browse/recently-listened/albums`;
    return this.http
      .get<PaginatedResponse<MpdAlbum>>(url, { params: params })
      .pipe(
        map((albums) => {
          albums.content.map((album) => {
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

import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { GenreResponse } from "./../shared/messages/incoming/genres-response";

import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class GenresService {
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);

  listGenres(): Observable<string[]> {
    const url = `${this.settingsService.getBackendContextAddr()}api/genres`;
    return this.http.get<string[]>(url);
  }

  listGenre(
    genre: string,
    pageIndex: number | null,
    pageSize: number | null,
  ): Observable<GenreResponse> {
    let params = new HttpParams();
    if (genre) {
      params = params.append("genre", genre);
    }
    if (pageIndex) {
      params = params.append("pageIndex", encodeURIComponent(pageIndex));
    }
    if (pageSize) {
      params = params.append("pageSize", encodeURIComponent(pageSize));
    }
    const url = `${this.settingsService.getBackendContextAddr()}api/genre`;
    return this.http.get<GenreResponse>(url, { params: params }).pipe(
      map((payload) => {
        payload.albums.content.map(
          (album) =>
            (album.albumCoverUrl = `${this.settingsService.getBackendContextAddr()}api/find-album-cover?albumName=${encodeURIComponent(
              album.name,
            )}&artistName=${encodeURIComponent(album.albumArtist)}`),
        );
        return payload;
      }),
    );
  }
}

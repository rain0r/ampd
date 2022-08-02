import { HttpClient, HttpUrlEncodingCodec } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { GenresPayload } from "../shared/models/http/genres";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class GenresService {
  private encoder = new HttpUrlEncodingCodec();

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  listGenres(): Observable<string[]> {
    const url = `${this.settingsService.getBackendContextAddr()}api/genres`;
    return this.http.get<string[]>(url);
  }

  listGenre(genre: string): Observable<GenresPayload> {
    const url = `${this.settingsService.getBackendContextAddr()}api/genre?genre=${genre}`;
    return this.http.get<GenresPayload>(url).pipe(
      map((payload) => {
        payload.albums.map(
          (album) =>
            (album.albumCoverUrl = `${this.settingsService.getBackendContextAddr()}api/find-album-cover?albumName=${this.encoder.encodeKey(
              album.name
            )}&artistName=${this.encoder.encodeKey(album.albumArtist)}`)
        );
        return payload;
      })
    );
  }
}

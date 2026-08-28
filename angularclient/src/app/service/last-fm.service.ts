import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { LastFmSimilarTracks } from "../shared/model/http/lastfm/last-fm-similar-tracks";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class LastFmService {
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);

  private backendAddress;

  constructor() {
    this.backendAddress = this.settingsService.getBackendContextAddr();
  }

  getSimilarTracks(
    artist: string,
    title: string,
  ): Observable<LastFmSimilarTracks> {
    const url = `${this.backendAddress}api/last-fm/similar-tracks?artist=${artist}&title=${title}`;
    return this.http.get<LastFmSimilarTracks>(url).pipe(
      catchError((err) => {
        throw `Failed to fetch similar tracks from LastFM: ${err.statusText}`;
      }),
    );
  }
}

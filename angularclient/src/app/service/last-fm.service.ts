import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { LastFmSimilarTracks } from "../shared/model/http/lastfm/last-fm-similar-tracks";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class LastFmService {
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);

  getSimilarTracks(
    artist: string,
    title: string,
  ): Observable<LastFmSimilarTracks> {
    const url = `${this.settingsService.getBackendContextAddr()}api/last-fm/similar-tracks?artist=${artist}&title=${title}`;
    return this.http.get<LastFmSimilarTracks>(url);
  }
}

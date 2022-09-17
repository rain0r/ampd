import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Track } from "../shared/models/http/lastfm/track";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class LastFmService {
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  getSimilarTracks(artist: string, title: string): Observable<Track[]> {
    const url = `${this.settingsService.getBackendContextAddr()}api/last-fm/similar-tracks?artist=${artist}&title=${title}`;
    return this.http.get<Track[]>(url);
  }

  getLastFmCred(): void {
    
  }
}

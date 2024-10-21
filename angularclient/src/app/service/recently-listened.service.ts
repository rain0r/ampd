import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SettingsService } from "./settings.service";
import { MpdAlbum } from "../shared/model/http/album";

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
    return this.http.get<MpdAlbum[]>(url);
  }
}

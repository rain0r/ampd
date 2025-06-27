import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { RadioStream } from "../shared/model/db/radio-stream";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class RadioStreamService {
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);

  addRadioStream(radioStream: RadioStream): Observable<RadioStream[]> {
    const url = `${this.settingsService.getBackendContextAddr()}api/radio-streams`;
    return this.http.post<RadioStream[]>(url, radioStream);
  }

  getRadioStreams(): Observable<RadioStream[]> {
    const url = `${this.settingsService.getBackendContextAddr()}api/radio-streams`;
    return this.http.get<RadioStream[]>(url);
  }

  deleteStream(id: number): Observable<RadioStream[]> {
    const url = `${this.settingsService.getBackendContextAddr()}api/radio-streams/${id}`;
    return this.http.delete<RadioStream[]>(url);
  }

  uploadImportFile(formData: FormData): Observable<unknown> {
    return this.http.post<unknown>(
      `${this.settingsService.getBackendContextAddr()}api/radio-streams/import`,
      formData,
    );
  }
}

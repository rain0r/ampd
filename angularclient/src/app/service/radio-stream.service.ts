import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { RadioStream } from "../shared/model/db/radio-stream";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class RadioStreamService {
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);

  private backendAddress;

  constructor() {
    this.backendAddress = this.settingsService.getBackendContextAddr();
  }

  addRadioStream(radioStream: RadioStream): Observable<RadioStream[]> {
    const url = `${this.backendAddress}api/radio-streams`;
    return this.http.post<RadioStream[]>(url, radioStream).pipe(
      catchError((err) => {
        throw `Failed to add radio stream: ${err.statusText}`;
      }),
    );
  }

  getRadioStreams(): Observable<RadioStream[]> {
    const url = `${this.backendAddress}api/radio-streams`;
    return this.http.get<RadioStream[]>(url).pipe(
      catchError((err) => {
        throw `Failed to fetch radio stream: ${err.statusText}`;
      }),
    );
  }

  deleteStream(id: number): Observable<RadioStream[]> {
    const url = `${this.backendAddress}api/radio-streams/${id}`;
    return this.http.delete<RadioStream[]>(url).pipe(
      catchError((err) => {
        throw `Failed to delete radio stream: ${err.statusText}`;
      }),
    );
  }

  uploadImportFile(formData: FormData): Observable<unknown> {
    return this.http
      .post<unknown>(`${this.backendAddress}api/radio-streams/import`, formData)
      .pipe(
        catchError((err) => {
          throw `Failed upload import file: ${err.statusText}`;
        }),
      );
  }
}

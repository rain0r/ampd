import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { PaginatedResponse } from "../shared/messages/incoming/paginated-response";
import { Track } from "../shared/messages/incoming/track";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);

  private backendAddress;

  constructor() {
    this.backendAddress = this.settingsService.getBackendContextAddr();
  }

  search(
    term: string,
    pageIndex: number | null,
    pageSize: number | null,
  ): Observable<PaginatedResponse<Track>> {
    let params = new HttpParams();
    if (pageIndex) {
      params = params.append("pageIndex", pageIndex);
    }
    if (pageSize) {
      params = params.append("pageSize", pageSize);
    }
    params = params.append("term", term);
    const url = `${this.backendAddress}api/search`;
    return this.http
      .get<PaginatedResponse<Track>>(url, { params: params })
      .pipe(
        catchError((err) => {
          throw `Failed to execute search: ${err.statusText}`;
        }),
      );
  }

  advSearch(
    formData: Record<string, string>,
    pageIndex: number | null,
    pageSize: number | null,
  ): Observable<PaginatedResponse<Track>> {
    let params = new HttpParams();
    if (pageIndex) {
      params = params.append("pageIndex", pageIndex);
    }
    if (pageSize) {
      params = params.append("pageSize", pageSize);
    }
    for (const key in formData) {
      if (formData[key]) {
        params = params.append(key, formData[key] || "");
      }
    }
    const url = `${this.backendAddress}api/adv-search`;
    return this.http
      .get<PaginatedResponse<Track>>(url, { params: params })
      .pipe(
        catchError((err) => {
          throw `Failed to execute advanced search: ${err.statusText}`;
        }),
      );
  }

  /**
   * Add all search results to the queue.
   * @param formData
   */
  addAll(formData: Record<string, string>): Observable<void> {
    return this.http
      .post<void>(`${this.backendAddress}api/adv-search`, formData)
      .pipe(
        catchError((err) => {
          throw `Failed to add tracks: ${err.statusText}`;
        }),
      );
  }
}

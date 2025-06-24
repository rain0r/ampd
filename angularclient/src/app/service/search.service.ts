import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { PaginatedResponse } from "../shared/messages/incoming/paginated-response";
import { Track } from "../shared/messages/incoming/track";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  private http = inject(HttpClient);
  private settingsService = inject(SettingsService);

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
    const url = `${this.settingsService.getBackendContextAddr()}api/search`;
    return this.http.get<PaginatedResponse<Track>>(url, { params: params });
  }

  advSearch(
    formData: Record<string, string>,
    pageIndex: number,
    pageSize: number,
  ): Observable<PaginatedResponse<Track>> {
    let params = new HttpParams();
    params = params.append("pageIndex", pageIndex);
    params = params.append("pageSize", pageSize);
    for (const key in formData) {
      if (formData[key]) {
        params = params.append(key, formData[key] || "");
      }
    }
    const url = `${this.settingsService.getBackendContextAddr()}api/adv-search`;
    return this.http.get<PaginatedResponse<Track>>(url, { params: params });
  }

  /**
   * Add all search results to the queue.
   * @param formData
   */
  addAll(formData: Record<string, string>): Observable<void> {
    return this.http.post<void>(
      `${this.settingsService.getBackendContextAddr()}api/adv-search`,
      formData,
    );
  }
}

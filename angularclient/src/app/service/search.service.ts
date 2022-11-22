import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AdvSearchResponse } from "../shared/model/http/adv-search-response";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  search(
    term: string,
    pageIndex: number | null,
    pageSize: number | null
  ): Observable<AdvSearchResponse> {
    let params = new HttpParams();
    if (!!pageIndex) {
      params = params.append("pageIndex", pageIndex);
    }
    if (!!pageSize) {
      params = params.append("pageSize", pageSize);
    }
    params = params.append("term", term);
    const url = `${this.settingsService.getBackendContextAddr()}api/search`;
    return this.http.get<AdvSearchResponse>(url, { params: params });
  }

  advSearch(
    formData: Record<string, string>,
    pageIndex: number,
    pageSize: number
  ): Observable<AdvSearchResponse> {
    let params = new HttpParams();
    params = params.append("pageIndex", pageIndex);
    params = params.append("pageSize", pageSize);
    for (const key in formData) {
      if (!!formData[key]) {
        params = params.append(key, formData[key] || "");
      }
    }
    const url = `${this.settingsService.getBackendContextAddr()}api/adv-search`;
    return this.http.get<AdvSearchResponse>(url, { params: params });
  }

  /**
   * Add all search results to the queue.
   * @param formData
   */
  addAll(formData: Record<string, string>): Observable<void> {
    return this.http.post<void>(
      `${this.settingsService.getBackendContextAddr()}api/adv-search`,
      formData
    );
  }
}

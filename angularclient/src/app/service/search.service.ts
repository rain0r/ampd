import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { SearchResponse } from "../shared/messages/incoming/search-response";
import { AdvSearchResponse } from "../shared/model/http/adv-search-response";
import { AmpdRxStompService } from "./ampd-rx-stomp.service";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  constructor(
    private rxStompService: AmpdRxStompService,
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  search(term: string): void {
    this.rxStompService.publish({
      destination: "/app/search/",
      body: term,
    });
  }

  getSearchSubscription(): Observable<SearchResponse> {
    return this.rxStompService.watch("/topic/search").pipe(
      map((message) => message.body),
      map((body: string) => <SearchResponse>JSON.parse(body)),
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      ),
      switchMap((searchResponse) => {
        return of(searchResponse);
      })
    );
  }

  advSearch(
    formData: Record<string, string>,
    page = 0
  ): Observable<AdvSearchResponse> {
    let params = new HttpParams();
    params = params.append("page", page);
    for (const key in formData) {
      if (!!formData[key]) {
        params = params.append(key, formData[key] || "");
      }
    }
    const url = `${this.settingsService.getBackendContextAddr()}api/adv-search`;
    return this.http.get<AdvSearchResponse>(url, { params: params });
  }
}

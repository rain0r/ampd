import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { SearchResponse } from "../shared/messages/incoming/search-response";
import { AdvSearchResponse } from "../shared/model/http/adv-search-response";
import { QueueTrack } from "../shared/model/queue-track";
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

  advSearch(formData: Record<string, string>): Observable<QueueTrack[]> {
    let params = new HttpParams();
    for (const key in formData) {
      params = params.append(key, formData[key] || "");
    }
    const url = `${this.settingsService.getBackendContextAddr()}api/adv-search`;
    return this.http.get<AdvSearchResponse>(url, { params: params }).pipe(
      map((response) => response.content),
      map((tracks) => {
        return tracks.map((track, index) => new QueueTrack(track, index));
      })
    );
  }
}

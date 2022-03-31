import { Injectable } from "@angular/core";
import { RxStompService } from "@stomp/ng2-stompjs";
import { Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { SearchResponse } from "../messages/incoming/search-response";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  constructor(private rxStompService: RxStompService) {}

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
      )
    );
  }
}

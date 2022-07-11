import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { SearchResponse } from "../shared/messages/incoming/search-response";
import { AmpdRxStompService } from "./ampd-rx-stomp.service";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  constructor(private rxStompService: AmpdRxStompService) {}

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

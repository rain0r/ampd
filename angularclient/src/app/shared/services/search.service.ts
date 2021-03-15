import { Injectable } from "@angular/core";
import { RxStompService } from "@stomp/ng2-stompjs";
import { Observable } from "rxjs";
import { SearchMsgPayload } from "../messages/incoming/search";
import { MpdTypes } from "../mpd/mpd-types";
import { filter, map } from "rxjs/operators";
import { BaseResponse } from "../messages/incoming/base-response";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  constructor(private rxStompService: RxStompService) {}

  search(term: string): void {
    this.rxStompService.publish({
      destination: "/app/search",
      body: term,
    });
  }

  getSearchSubscription(): Observable<SearchMsgPayload> {
    return this.rxStompService.watch("/topic/search").pipe(
      map((message) => message.body),
      map((body: string) => <BaseResponse>JSON.parse(body)),
      filter((body: BaseResponse) => body !== null),
      filter((body: BaseResponse) => body.type === MpdTypes.SEARCH_RESULTS),
      map((body: BaseResponse) => <SearchMsgPayload>body.payload)
    );
  }
}

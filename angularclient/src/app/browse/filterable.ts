import { filter, map } from "rxjs/operators";
import { MsgService } from "../service/msg.service";
import {
  FilterMsg,
  InternMsgType,
} from "../shared/messages/internal/internal-msg";

export abstract class Filterable {
  filterValue = "";

  protected constructor(messageService: MsgService) {
    messageService.message
      .pipe(
        filter((msg) => msg.type === InternMsgType.BrowseFilter),
        map((msg) => msg as FilterMsg),
      )
      .subscribe(
        (message) =>
          (this.filterValue = message.filterValue
            ? message.filterValue.trim()
            : ""),
      );
  }
}

import { MessageService } from "../shared/services/message.service";
import { filter, map } from "rxjs/operators";
import { InternalMessageType } from "../shared/messages/internal/internal-message-type.enum";
import { FilterMessage } from "../shared/messages/internal/message-types/filter-message";

export abstract class Filterable {
  filterValue = "";

  protected constructor(messageService: MessageService) {
    messageService
      .getMessage()
      .pipe(
        filter((msg) => msg.type === InternalMessageType.BrowseFilter),
        map((msg) => msg as FilterMessage)
      )
      .subscribe(
        (message) =>
          (this.filterValue = message.filterValue ? message.filterValue : "")
      );
  }
}

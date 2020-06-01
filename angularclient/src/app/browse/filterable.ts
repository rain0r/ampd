import {Subscription} from "rxjs/index";
import {MessageService} from "../shared/services/message.service";
import {AmpdMessage} from "../shared/messages/internal/ampd-message";
import {filter} from "rxjs/operators";
import {BROWSE_FILTER} from "../shared/commands/internal";

export abstract class Filterable {
  filterValue = "";
  private subscription: Subscription = new Subscription();

  protected constructor(messageService: MessageService) {
    this.subscription = messageService
      .getMessage()
      .pipe(filter((msg: AmpdMessage) => msg.type === BROWSE_FILTER))
      .subscribe((message: AmpdMessage) => {
        this.filterValue = message.data ? message.data : "";
      });
  }
}

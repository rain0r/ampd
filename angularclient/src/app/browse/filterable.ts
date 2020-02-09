import { Subscription } from 'rxjs/index';
import { InternalCommands } from '../shared/commands/internal';
import { MessageService } from '../shared/services/message.service';

export abstract class Filterable {
  protected filterValue = '';
  private subscription: Subscription = new Subscription();

  constructor(pMessageService: MessageService) {
    const messageService = pMessageService;
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === InternalCommands.BROWSE_FILTER) {
        if (message.data && message.data.filterValue) {
          this.filterValue = message.data.filterValue;
        } else {
          this.filterValue = '';
        }
      }
    });
  }
}

import { Subscription } from 'rxjs/index';
import { InternalCommands } from '../shared/commands/internal';
import { MessageService } from '../shared/services/message.service';

export abstract class FilterableImpl {
  protected filterValue = '';
  private subscription: Subscription = new Subscription();

  constructor(pMessageService: MessageService) {
    const messageService = pMessageService;
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === InternalCommands.BROWSE_FILTER) {
        if (message.data && message.data.filterValue) {
          this.filter(message.data.filterValue);
        }
      }
    });
  }
  protected filter(filterValue: string) {
    if (filterValue) {
      this.filterValue = filterValue;
    }
  }
}

import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Directory } from '../../shared/messages/incoming/directory';
import { MpdCommands } from '../../shared/mpd/mpd-commands';
import { MessageService } from '../../shared/services/message.service';
import { NotificationService } from '../../shared/services/notification.service';
import { WebSocketService } from '../../shared/services/web-socket.service';
import { Filterable } from '../filterable';

@Component({
  selector: 'app-directories',
  templateUrl: './directories.component.html',
  styleUrls: ['./directories.component.scss'],
})
export class DirectoriesComponent extends Filterable {
  @Input() public dirQueue: Directory[] = [];
  public getParamDir = '/';

  constructor(
    private activatedRoute: ActivatedRoute,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {
    super(messageService);
    this.getParamDir =
      this.activatedRoute.snapshot.queryParamMap.get('dir') || '/';
  }

  public onPlayDir(dir: string): void {
    this.onAddDir(dir);
    this.webSocketService.send(MpdCommands.SET_PLAY);
    this.notificationService.popUp(`Playing dir: "${dir}"`);
  }

  public onAddDir(dir: string): void {
    if (event) {
      event.stopPropagation();
    }
    if (dir.startsWith('/')) {
      dir = dir.substr(1, dir.length);
    }
    this.webSocketService.sendData(MpdCommands.ADD_DIR, {
      dir,
    });
    this.notificationService.popUp(`Added dir: "${dir}"`);
  }
}

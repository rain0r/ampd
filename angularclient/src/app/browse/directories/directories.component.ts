import { Component, HostListener, Input } from '@angular/core';
import { Directory } from '../../shared/messages/incoming/directory';
import { BrowseService } from '../../shared/services/browse.service';
import { NotificationService } from '../../shared/services/notification.service';
import { WebSocketService } from '../../shared/services/web-socket.service';

@Component({
  selector: 'app-directories',
  templateUrl: './directories.component.html',
  styleUrls: ['./directories.component.css'],
})
export class DirectoriesComponent {
  @Input() public dirQueue: Directory[] = [];

  constructor(
    private browseService: BrowseService,
    private notificationService: NotificationService,
    private webSocketService: WebSocketService
  ) {}

  @HostListener('click', ['$event'])
  public onDirClick(directory: string): void {
    if (event) {
      event.stopPropagation();
    }
    this.browseService.browse(directory);
    // const splittedPath: string = this.splitDir(directory);
    // let targetDir: string = this.getParamDir
    //     ? this.getParamDir + '/' + splittedPath
    //     : splittedPath;
    // targetDir = targetDir.replace(/\/+(?=\/)/g, '');
    // this.router.navigate(['browse'], { queryParams: { dir: targetDir } });
  }
}

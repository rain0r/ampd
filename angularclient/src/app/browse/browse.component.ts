import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BrowseInfo } from '../shared/models/browse-info';
import { MpdCommands } from '../shared/mpd/mpd-commands';
import { BrowseService } from '../shared/services/browse.service';
import { NotificationService } from '../shared/services/notification.service';
import { WebSocketService } from '../shared/services/web-socket.service';

export interface IBreadcrumbItem {
  text: string;
  link: string;
}

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent {
  public getParamDir = '';
  public containerWidth = 1;
  public browseInfo: BrowseInfo = new BrowseInfo();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService,
    private browseService: BrowseService
  ) {
    this.buildBrowseDir();
    this.browseInfo = this.browseService.browseInfo;
    this.calculateContainerWidth();
  }

  public onClearQueue(): void {
    this.webSocketService.send(MpdCommands.RM_ALL);
  }

  public onMoveDirUp(): void {
    const splitted = this.getParamDir.split('/');
    splitted.pop();
    let targetDir = splitted.join('/');
    if (targetDir.length === 0) {
      targetDir = '/';
    }
    this.router.navigate(['browse'], { queryParams: { dir: targetDir } });
  }

  @HostListener('click', ['$event'])
  public onAddDir(dir: string): void {
    if (event) {
      event.stopPropagation();
    }
    if (typeof dir !== 'string') {
      return;
    }
    if (dir.startsWith('/')) {
      dir = dir.substr(1, dir.length);
    }
    this.webSocketService.sendData(MpdCommands.ADD_DIR, {
      dir,
    });
    this.notificationService.popUp(`Added dir: "${dir}"`);
  }

  @HostListener('click', ['$event'])
  public onPlayDir(dir: string): void {
    if (typeof dir !== 'string') {
      return;
    }
    this.onAddDir(dir);
    this.webSocketService.send(MpdCommands.SET_PLAY);
    this.notificationService.popUp(`Playing dir: "${dir}"`);
  }

  private buildBrowseDir() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let dir = '/';
      if ('dir' in params) {
        dir = params.dir;
      }
      this.getParamDir = dir;
      this.browseService.sendBrowseReq(dir);
    });
  }

  private calculateContainerWidth() {
    let tmpCount = 0;
    if (this.browseInfo.dirQueue.length > 0) {
      tmpCount += 1;
    }
    if (this.browseInfo.trackQueue.length > 0) {
      tmpCount += 1;
    }
    if (this.browseInfo.playlistQueue.length > 0) {
      tmpCount += 1;
    }

    tmpCount = tmpCount > 0 ? tmpCount : 1;
    this.containerWidth = 100 / tmpCount;
  }
}

import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowseInfo } from '../shared/models/browse-info';
import { MpdCommands } from '../shared/mpd/mpd-commands';
import { BrowseService } from '../shared/services/browse.service';
import { NotificationService } from '../shared/services/notification.service';
import { WebSocketService } from '../shared/services/web-socket.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit {
  public getParamDir = '';
  public browseInfo: BrowseInfo = new BrowseInfo();

  constructor(
    private activatedRoute: ActivatedRoute,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService,
    private browseService: BrowseService
  ) {
    this.browseInfo = this.browseService.browseInfo;
  }

  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      const dir = queryParams.dir || '/';
      this.getParamDir = dir;
      this.browseService.sendBrowseReq(dir);
    });
  }

  public onClearQueue(): void {
    this.webSocketService.send(MpdCommands.RM_ALL);
    this.webSocketService.send(MpdCommands.GET_QUEUE);
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
}

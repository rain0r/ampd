import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BrowseInfo } from '../shared/models/browse-info';
import { MpdCommands } from '../shared/mpd/mpd-commands';
import { BrowseService } from '../shared/services/browse.service';
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

  public onBackToTop(): void {
    window.scrollTo(0, 0);
  }

  public onClearQueue(): void {
    this.webSocketService.send(MpdCommands.RM_ALL);
    this.webSocketService.send(MpdCommands.GET_QUEUE);
  }
}

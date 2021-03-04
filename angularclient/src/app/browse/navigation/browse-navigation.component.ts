import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BrowseService } from "../../shared/services/browse.service";
import { MessageService } from "../../shared/services/message.service";
import { NotificationService } from "../../shared/services/notification.service";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { InternalMessageType } from "../../shared/messages/internal/internal-message-type.enum";
import { FilterMessage } from "../../shared/messages/internal/message-types/filter-message";
import { MpdCommands } from "../../shared/mpd/mpd-commands.enum";
import { BrowseInfo } from "../../shared/models/browse-info";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-navigation",
  templateUrl: "./browse.navigation.component.html",
  styleUrls: ["./browse.navigation.component.scss"],
})
export class BrowseNavigationComponent implements OnInit {
  @ViewChild("filterInputElem") myInputField: ElementRef;

  displayFilter$ = new BehaviorSubject<boolean>(true);
  getParamDir = "";
  filter = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private browseService: BrowseService,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private router: Router,
    private webSocketService: WebSocketService
  ) {}

  @HostListener("document:keydown.f", ["$event"])
  onSearchKeydownHandler(event: KeyboardEvent): void {
    if ((event.target as HTMLInputElement).tagName === "INPUT") {
      return;
    }
    event.preventDefault();
    (this.myInputField.nativeElement as HTMLElement).focus();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const dir = <string>queryParams.dir || "/";
      this.getParamDir = dir;
      this.browseService.sendBrowseReq(dir);
    });
    this.browseService.browseInfo.subscribe((browseInfo) => {
      // We don't support filtering the tracks of a single album
      this.displayFilter$.next(!this.isTracksOnly(browseInfo));
    });
  }

  onAddDir(dir: string): void {
    if (typeof dir !== "string") {
      return;
    }
    if (dir.startsWith("/")) {
      dir = dir.substr(1, dir.length);
    }
    this.webSocketService.sendData(MpdCommands.ADD_DIR, {
      dir,
    });
    this.notificationService.popUp(`Added dir: "${dir}"`);
  }

  onPlayDir(dir: string): void {
    this.onAddDir(dir);
    this.webSocketService.send(MpdCommands.SET_PLAY);
    this.notificationService.popUp(`Playing directory: "${dir}"`);
  }

  onMoveDirUp(): void {
    const splitted = this.getParamDir.split("/");
    splitted.pop();
    let targetDir = splitted.join("/");
    if (targetDir.length === 0) {
      targetDir = "/";
    }
    this.router
      .navigate(["browse"], { queryParams: { dir: targetDir } })
      .then((fulfilled) => {
        if (fulfilled) {
          this.getParamDir = targetDir;
        }
      })
      .catch(() => void 0);
  }

  onClearQueue(): void {
    this.webSocketService.send(MpdCommands.RM_ALL);
    this.webSocketService.send(MpdCommands.GET_QUEUE);
    this.notificationService.popUp("Cleared queue");
  }

  applyFilter(term: string): void {
    this.filter = term;
    if (term) {
      this.messageService.sendMessage({
        type: InternalMessageType.BrowseFilter,
        filterValue: term,
      } as FilterMessage);
    } else {
      this.resetFilter();
    }
  }

  resetFilter(): void {
    this.filter = "";
    this.messageService.sendMessage({
      type: InternalMessageType.BrowseFilter,
      filterValue: "",
    } as FilterMessage);
  }

  private isTracksOnly(browseInfo: BrowseInfo): boolean {
    return (
      browseInfo.dirQueue.length === 0 &&
      browseInfo.playlistQueue.length === 0 &&
      browseInfo.trackQueue.length > 0
    );
  }
}

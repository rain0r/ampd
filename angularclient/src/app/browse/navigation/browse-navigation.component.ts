import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "../../shared/services/message.service";
import { NotificationService } from "../../shared/services/notification.service";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { InternalMessageType } from "../../shared/messages/internal/internal-message-type.enum";
import { FilterMessage } from "../../shared/messages/internal/message-types/filter-message";
import { MpdCommands } from "../../shared/mpd/mpd-commands.enum";
import { BrowseService } from "../../shared/services/browse.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-navigation",
  templateUrl: "./browse.navigation.component.html",
  styleUrls: ["./browse.navigation.component.scss"],
})
export class BrowseNavigationComponent implements OnInit {
  @ViewChild("filterInputElem") filterInputElem?: ElementRef;

  getParamDir = "";
  filter = "";
  dirUp$ = new BehaviorSubject<string>("/");

  constructor(
    private activatedRoute: ActivatedRoute,
    private browseService: BrowseService,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private router: Router,
    private webSocketService: WebSocketService
  ) {
    this.buildDirUp();
  }

  @HostListener("document:keydown.f", ["$event"])
  onSearchKeydownHandler(event: KeyboardEvent): void {
    if ((event.target as HTMLInputElement).tagName === "INPUT") {
      return;
    }
    event.preventDefault();
    if (this.filterInputElem) {
      (this.filterInputElem.nativeElement as HTMLElement).focus();
    }
  }

  ngOnInit(): void {
    // this.activatedRoute.queryParams.subscribe((queryParams) => {
    //   const dir = <string>queryParams.dir || "/";
    //   this.getParamDir = dir;
    //   this.browseService.sendBrowseReq(dir);
    // });
  }

  onAddDir(dir: string): void {
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

  onClearQueue(): void {
    this.webSocketService.send(MpdCommands.RM_ALL);
    this.webSocketService.send(MpdCommands.GET_QUEUE);
    this.notificationService.popUp("Cleared queue");
  }

  applyFilter(eventTarget: EventTarget | null): void {
    if (!eventTarget) {
      return;
    }
    const term = (<HTMLInputElement>eventTarget).value;
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

  private buildDirUp(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const dir = <string>queryParams.dir || "/";
      const splitted = dir.split("/");
      splitted.pop();
      let targetDir = splitted.join("/");
      if (targetDir.length === 0) {
        targetDir = "/";
      }
      this.dirUp$.next(targetDir);
    });
  }
}

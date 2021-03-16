import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "../../shared/services/message.service";
import { NotificationService } from "../../shared/services/notification.service";
import { InternalMessageType } from "../../shared/messages/internal/internal-message-type.enum";
import { FilterMessage } from "../../shared/messages/internal/message-types/filter-message";
import { BehaviorSubject, Observable } from "rxjs";
import { AmpdBrowsePayload } from "../../shared/models/ampd-browse-payload";
import { MpdService } from "../../shared/services/mpd.service";
import { ControlPanelService } from "../../shared/services/control-panel.service";
import { QueueService } from "../../shared/services/queue.service";

@Component({
  selector: "app-navigation",
  templateUrl: "./browse.navigation.component.html",
  styleUrls: ["./browse.navigation.component.scss"],
})
export class BrowseNavigationComponent implements OnInit {
  @ViewChild("filterInputElem") filterInputElem?: ElementRef;
  @Input()
  browsePayload: Observable<AmpdBrowsePayload> = new Observable<AmpdBrowsePayload>();

  dirUp$ = new BehaviorSubject<string>("/");
  displayFilter$ = new BehaviorSubject<boolean>(true);
  filter = "";
  getParamDir = "/";

  constructor(
    private activatedRoute: ActivatedRoute,
    private controlPanelService: ControlPanelService,
    private messageService: MessageService,
    private mpdService: MpdService,
    private notificationService: NotificationService,
    private queueService: QueueService
  ) {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const dir = <string>queryParams.dir || "/";
      this.buildDirUp(dir);
      this.getParamDir = dir;
    });
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
    this.browsePayload.subscribe((foo) =>
      this.displayFilter$.next(!this.isTracksOnlyDir(foo))
    );
  }

  onAddDir(dir: string): void {
    if (dir.startsWith("/")) {
      dir = dir.substr(1, dir.length);
    }
    this.queueService.addDir(dir);
    this.notificationService.popUp(`Added dir: "${dir}"`);
  }

  onPlayDir(dir: string): void {
    this.onAddDir(dir);
    this.controlPanelService.play();
    this.notificationService.popUp(`Playing directory: "${dir}"`);
  }

  onClearQueue(): void {
    this.mpdService.clearQueue();
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

  private buildDirUp(dir: string): void {
    const splitted = dir.split("/");
    splitted.pop();
    let targetDir = splitted.join("/");
    if (targetDir.length === 0) {
      targetDir = "/";
    }
    this.dirUp$.next(targetDir);
  }

  private isTracksOnlyDir(tmpPayload: AmpdBrowsePayload): boolean {
    return (
      tmpPayload.playlists.length === 0 &&
      tmpPayload.directories.length === 0 &&
      tmpPayload.tracks.length > 0
    );
  }
}

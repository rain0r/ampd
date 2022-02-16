import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { InternalMessageType } from "../../shared/messages/internal/internal-message-type.enum";
import { FilterMessage } from "../../shared/messages/internal/message-types/filter-message";
import { AmpdBrowsePayload } from "../../shared/models/ampd-browse-payload";
import { ControlPanelService } from "../../shared/services/control-panel.service";
import { MessageService } from "../../shared/services/message.service";
import { MpdService } from "../../shared/services/mpd.service";
import { NotificationService } from "../../shared/services/notification.service";
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
    this.activatedRoute.queryParamMap
      .pipe(
        map((qp) => <string>qp.get("dir") || "/"),
        distinctUntilChanged()
      )
      .subscribe((dir) => {
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
    this.browsePayload.subscribe((payload) =>
      this.displayFilter$.next(!this.isTracksOnlyDir(payload))
    );
  }

  onAddDir(dir: string): void {
    if (dir.startsWith("/")) {
      dir = dir.substring(1, dir.length);
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
    this.queueService.clearQueue();
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
    const splitted = decodeURIComponent(dir).split("/");
    splitted.pop();
    let targetDir = splitted.join("/");
    if (targetDir.length === 0) {
      targetDir = "";
    }
    this.dirUp$.next(encodeURIComponent(targetDir));
  }

  private isTracksOnlyDir(tmpPayload: AmpdBrowsePayload): boolean {
    return (
      tmpPayload.playlists.length === 0 &&
      tmpPayload.directories.length === 0 &&
      tmpPayload.tracks.length > 0
    );
  }
}

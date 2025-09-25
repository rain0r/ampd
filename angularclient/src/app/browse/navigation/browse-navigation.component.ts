import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  inject,
} from "@angular/core";
import { ActivatedRoute, RouterLinkActive, RouterLink } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { FrontendSettingsService } from "src/app/service/frontend-settings.service";
import { SettingsService } from "src/app/service/settings.service";
import {
  FilterMsg,
  InternMsgType,
} from "src/app/shared/messages/internal/internal-msg";
import { SettingKeys } from "src/app/shared/model/internal/frontend-settings";
import { ControlPanelService } from "../../service/control-panel.service";
import { MsgService } from "../../service/msg.service";
import { NotificationService } from "../../service/notification.service";
import { QueueService } from "../../service/queue.service";
import { AmpdBrowsePayload } from "../../shared/model/ampd-browse-payload";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { AsyncPipe } from "@angular/common";
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: "app-browse-navigation",
  templateUrl: "./browse.navigation.component.html",
  styleUrls: ["./browse.navigation.component.scss"],
  imports: [
    MatButton,
    RouterLinkActive,
    RouterLink,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatIconButton,
    MatSuffix,
    MatDivider,
    AsyncPipe,
  ],
})
export class BrowseNavigationComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private controlPanelService = inject(ControlPanelService);
  private fsService = inject(FrontendSettingsService);
  private messageService = inject(MsgService);
  private notificationService = inject(NotificationService);
  private queueService = inject(QueueService);
  private settingsService = inject(SettingsService);

  @ViewChild("filterInputElem") filterInputElem?: ElementRef;
  @Input() browsePayload = new Observable<AmpdBrowsePayload>();
  @Input() filterDisabled = false;

  dirUp$ = new BehaviorSubject<string>("/");
  filterDisabled$ = new BehaviorSubject<boolean>(true);
  filter = "";
  getParamDir = "/";
  displayAlbums$: Observable<boolean>;
  displayGenres$: Observable<boolean>;
  displayRadio$: Observable<boolean>;
  displayBrowseClearQueue$: Observable<boolean>;
  displayRecentlyListened$: Observable<boolean>;

  constructor() {
    this.displayAlbums$ = this.fsService.getBoolValue$(
      SettingKeys.DISPLAY_ALBUMS,
    );
    this.displayGenres$ = this.fsService.getBoolValue$(
      SettingKeys.DISPLAY_GENRES,
    );
    this.displayRadio$ = this.fsService.getBoolValue$(
      SettingKeys.DISPLAY_RADIO,
    );
    this.displayBrowseClearQueue$ = this.fsService.getBoolValue$(
      SettingKeys.DISPLAY_BROWSE_CLEAR_QUEUE,
    );
    this.displayRecentlyListened$ = this.fsService.getBoolValue$(
      SettingKeys.DISPLAY_RECENTLY_LISTENED,
    );

    this.activatedRoute.queryParamMap
      .pipe(
        map((qp) => (qp.get("dir") as string) || "/"),
        distinctUntilChanged(),
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
    if (this.filterDisabled) {
      // @Input() has precedence over a tracks-only-directory
      this.filterDisabled$.next(false);
    } else {
      this.browsePayload.subscribe((payload) =>
        this.filterDisabled$.next(!this.isTracksOnlyDir(payload)),
      );
    }
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
    const term = (eventTarget as HTMLInputElement).value;
    this.filter = term;
    if (term) {
      this.messageService.sendMessage({
        type: InternMsgType.BrowseFilter,
        filterValue: term,
      } as FilterMsg);
    } else {
      this.resetFilter();
    }
  }

  resetFilter(): void {
    this.filter = "";
    this.messageService.sendMessage({
      type: InternMsgType.BrowseFilter,
      filterValue: "",
    } as FilterMsg);
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

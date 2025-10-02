import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  ViewChild,
} from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Observable } from "rxjs";
import { FrontendSettingsService } from "src/app/service/frontend-settings.service";
import {
  FilterMsg,
  InternMsgType,
} from "src/app/shared/messages/internal/internal-msg";
import { SettingKeys } from "src/app/shared/model/internal/frontend-settings";
import { ControlPanelService } from "../../service/control-panel.service";
import { MsgService } from "../../service/msg.service";
import { NotificationService } from "../../service/notification.service";
import { QueueService } from "../../service/queue.service";

import { AsyncPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";

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
export class BrowseNavigationComponent {
  private controlPanelService = inject(ControlPanelService);
  private fsService = inject(FrontendSettingsService);
  private messageService = inject(MsgService);
  private notificationService = inject(NotificationService);
  private queueService = inject(QueueService);

  @ViewChild("filterInputElem") filterInputElem?: ElementRef;

  @Input() filterDisabled = true;
  @Input() dirParam = "/";
  @Input() dirUp = "/";

  filter = "";

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
}

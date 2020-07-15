import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Directory,
  DirectoryImpl,
} from "../../shared/messages/incoming/directory-impl";
import { MessageService } from "../../shared/services/message.service";
import { NotificationService } from "../../shared/services/notification.service";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { Filterable } from "../filterable";
import { MpdCommands } from "../../shared/mpd/mpd-commands.enum";

@Component({
  selector: "app-directories",
  templateUrl: "./directories.component.html",
  styleUrls: ["./directories.component.scss"],
})
export class DirectoriesComponent extends Filterable {
  @Input() dirQueue: DirectoryImpl[] = [];
  getParamDir = "/";

  constructor(
    private activatedRoute: ActivatedRoute,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService,
    private messageService: MessageService,
    private router: Router
  ) {
    super(messageService);
    this.getParamDir =
      this.activatedRoute.snapshot.queryParamMap.get("dir") || "/";
  }

  onPlayDir($event: MouseEvent, dir: string): void {
    $event.stopPropagation();
    this.onAddDir($event, dir);
    this.webSocketService.send(MpdCommands.SET_PLAY);
    this.notificationService.popUp(`Playing dir: "${dir}"`);
  }

  onAddDir($event: MouseEvent, dir: string): void {
    $event.stopPropagation();
    if (dir.startsWith("/")) {
      dir = dir.substr(1, dir.length);
    }
    this.webSocketService.sendData(MpdCommands.ADD_DIR, {
      dir,
    });
    this.notificationService.popUp(`Added dir: "${dir}"`);
  }

  onRowClick(dir: Directory): void {
    this.router
      .navigate(["browse"], { queryParams: { dir: dir.path } })
      .catch(() => void 0);
  }
}

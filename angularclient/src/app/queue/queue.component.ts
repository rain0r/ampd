import { Component, HostListener, OnInit } from "@angular/core";
import { WebSocketService } from "../shared/services/web-socket.service";
import { MpdCommands } from "../shared/mpd/mpd-commands.enum";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"],
})
export class QueueComponent implements OnInit {
  constructor(private webSocketService: WebSocketService) {}

  @HostListener("document:visibilitychange", ["$event"])
  onKeyUp(): void {
    if (document.visibilityState === "visible") {
      this.webSocketService.send(MpdCommands.GET_QUEUE);
    }
  }

  ngOnInit(): void {
    this.webSocketService.send(MpdCommands.GET_QUEUE);
  }
}

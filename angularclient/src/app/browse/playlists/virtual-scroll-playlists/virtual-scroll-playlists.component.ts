import { Component, Input } from "@angular/core";
import { Playlist } from "../../../shared/messages/incoming/playlist-impl";
import { Filterable } from "../../filterable";
import { MessageService } from "../../../shared/services/message.service";

@Component({
  selector: "app-virtual-scroll-playlists",
  templateUrl: "./virtual-scroll-playlists.component.html",
  styleUrls: ["./virtual-scroll-playlists.component.scss"],
})
export class VirtualScrollPlaylistsComponent extends Filterable {
  @Input() playlists: Playlist[] = [];

  constructor(private messageService: MessageService) {
    super(messageService);
  }
}

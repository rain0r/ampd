import { Component, Input } from "@angular/core";

@Component({
  selector: "app-mpd-server",
  templateUrl: "./mpd-server.component.html",
  styleUrls: ["./mpd-server.component.scss"],
})
export class MpdServerComponent {
  @Input() mpdServer = "localhost";
}

import { Component, Input } from "@angular/core";

@Component({
  selector: "app-mpd-port",
  templateUrl: "./mpd-port.component.html",
  styleUrls: ["./mpd-port.component.scss"],
})
export class MpdPortComponent {
  @Input() mpdPort = 6600;
}

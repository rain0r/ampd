import { Component, Input } from "@angular/core";

@Component({
  selector: "app-playlist-properties",
  templateUrl: "./playlist-properties.component.html",
  styleUrls: ["./playlist-properties.component.scss"],
})
export class PlaylistPropertiesComponent {
  @Input() createNewPlaylists = false;
  @Input() deleteExistingPlaylists = false;
}

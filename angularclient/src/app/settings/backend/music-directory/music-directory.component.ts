import { Component, Input } from "@angular/core";

@Component({
  selector: "app-music-directory",
  templateUrl: "./music-directory.component.html",
  styleUrls: ["./music-directory.component.scss"],
})
export class MusicDirectoryComponent {
  @Input() musicDirectory = "";
}

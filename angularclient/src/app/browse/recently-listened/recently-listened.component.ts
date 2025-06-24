import { Component } from "@angular/core";
import { BrowseNavigationComponent } from "../navigation/browse-navigation.component";
import { RecentlyListenedAlbumsComponent } from "./recently-listened-albums/recently-listened-albums.component";

@Component({
  selector: "app-recently-listened",
  templateUrl: "./recently-listened.component.html",
  styleUrl: "./recently-listened.component.css",
  imports: [BrowseNavigationComponent, RecentlyListenedAlbumsComponent],
})
export class RecentlyListenedComponent {}

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AlbumsComponent } from "./browse/albums/albums.component";
import { BrowseComponent } from "./browse/browse.component";
import { GenresComponent } from "./browse/genres/genres.component";
import { RadioStreamsComponent } from "./browse/radio-streams/radio-streams.component";
import { QueueComponent } from "./queue/queue.component";
import { AdvancedSearchComponent } from "./search/advanced-search/advanced-search.component";
import { SearchComponent } from "./search/search.component";
import { SettingsComponent } from "./settings/settings.component";
import { RecentlyListenedComponent } from "./browse/recently-listened/recently-listened.component";

const routes: Routes = [
  { path: "", component: QueueComponent },
  { path: "browse", component: BrowseComponent },
  { path: "browse/albums", component: AlbumsComponent },
  { path: "browse/genres", component: GenresComponent },
  { path: "browse/radio-streams", component: RadioStreamsComponent },
  { path: "browse/recently-listened", component: RecentlyListenedComponent },
  { path: "search", component: SearchComponent },
  { path: "adv-search", component: AdvancedSearchComponent },
  { path: "settings", component: SettingsComponent },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { GenresComponent } from "./browse/genres/genres.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AlbumModalComponent } from "./browse/albums/album-modal/album-modal.component";
import { AlbumsComponent } from "./browse/albums/albums.component";
import { BrowseComponent } from "./browse/browse.component";
import { QueueComponent } from "./queue/queue.component";
import { SearchComponent } from "./search/search.component";
import { SettingsComponent } from "./settings/settings.component";

const routes: Routes = [
  { path: "", component: QueueComponent },
  { path: "browse", component: BrowseComponent },
  { path: "browse/albums", component: AlbumsComponent },
  { path: "browse/album-detail", component: AlbumModalComponent },
  { path: "browse/genres", component: GenresComponent },
  { path: "search", component: SearchComponent },
  { path: "settings", component: SettingsComponent },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: "legacy",
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

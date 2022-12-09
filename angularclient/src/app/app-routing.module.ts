import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddStreamComponent } from "./browse/add-radio-stream/add-radio-stream.component";
import { AlbumDialogComponent } from "./browse/albums/album-dialog/album-dialog.component";
import { AlbumsComponent } from "./browse/albums/albums.component";
import { BrowseComponent } from "./browse/browse.component";
import { GenresComponent } from "./browse/genres/genres.component";
import { QueueComponent } from "./queue/queue.component";
import { AdvancedSearchComponent } from "./search/advanced-search/advanced-search.component";
import { SearchComponent } from "./search/search.component";
import { SettingsComponent } from "./settings/settings.component";

const routes: Routes = [
  { path: "", component: QueueComponent },
  { path: "browse", component: BrowseComponent },
  { path: "browse/albums", component: AlbumsComponent },
  { path: "browse/album-detail", component: AlbumDialogComponent },
  { path: "browse/genres", component: GenresComponent },
  { path: "browse/radio-streams", component: AddStreamComponent },
  { path: "search", component: SearchComponent },
  { path: "adv-search", component: AdvancedSearchComponent },
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

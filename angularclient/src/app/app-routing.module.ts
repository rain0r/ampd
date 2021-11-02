import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AlbumsComponent } from "./albums/albums.component";
import { BrowseComponent } from "./browse/browse.component";
import { QueueComponent } from "./queue/queue.component";
import { SearchComponent } from "./search/search.component";
import { SettingsComponent } from "./settings/settings.component";

const routes: Routes = [
  { path: "", component: QueueComponent },
  { path: "browse", component: BrowseComponent },
  { path: "search", component: SearchComponent },
  { path: "settings", component: SettingsComponent },
  { path: "albums", component: AlbumsComponent },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

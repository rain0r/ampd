import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BrowseComponent } from "./browse/browse.component";
import { QueueComponent } from "./queue/queue.component";
import { SearchComponent } from "./search/search.component";
import { SettingsComponent } from "./settings/settings.component";

const routes: Routes = [
  { path: "", component: QueueComponent },
  { path: "browse", component: BrowseComponent },
  { path: "search", component: SearchComponent },
  { path: "settings", component: SettingsComponent },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

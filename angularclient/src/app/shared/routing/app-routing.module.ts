import { RouterModule, Routes } from '@angular/router';
import { QueueComponent } from '../../queue/queue.component';
import { BrowseComponent } from '../../browse/browse.component';
import { NgModule } from '@angular/core';
import { SearchComponent } from '../../search/search.component';
import { SettingsComponent } from '../../settings/settings.component';

const routes: Routes = [
  { path: '', component: QueueComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'search', component: SearchComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

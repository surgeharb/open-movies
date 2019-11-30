import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TorrentsComponent } from './torrents/torrents.component';
import { TorrentDetailsComponent } from './torrent-details/torrent-details.component';

const routes: Routes = [
  { path: '', component: TorrentsComponent },
  { path: 'torrents/:id', component: TorrentDetailsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

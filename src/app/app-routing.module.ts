import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TorrentsComponent } from './torrents/torrents.component';

const routes: Routes = [
  { path: '', component: TorrentsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

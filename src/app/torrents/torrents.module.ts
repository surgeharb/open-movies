import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TorrentsComponent } from './torrents.component';
import { MaterialModule } from '../@core/modules/material.module';
import { MovieComponent } from '../@core/components/movie/movie.component';

@NgModule({
  declarations: [
    MovieComponent,
    TorrentsComponent,
  ],
  providers: [],
  imports: [
    CommonModule,
    MaterialModule,
  ],

  exports: [TorrentsComponent],
})
export class TorrentsModule { }

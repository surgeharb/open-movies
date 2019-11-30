import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TorrentsComponent } from './torrents.component';
import { MaterialModule } from '../@core/modules/material.module';
import { SingleTorrentComponent } from '../@core/components/torrent/torrent.component';
import { InfiniteScrollComponent } from '../@core/components/infinite-scroll/infinite-scroll.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    TorrentsComponent,
    SingleTorrentComponent,
    InfiniteScrollComponent,
  ],
  providers: [],
  imports: [
    CommonModule,
    MaterialModule,
    LazyLoadImageModule,
  ],

  exports: [TorrentsComponent],
})
export class TorrentsModule { }

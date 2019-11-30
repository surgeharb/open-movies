import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../@core/modules/material.module';
import { TorrentDetailsComponent } from './torrent-details.component';

@NgModule({
  declarations: [TorrentDetailsComponent],
  imports: [
    CommonModule,
    MaterialModule,
  ]
})
export class TorrentDetailsModule { }

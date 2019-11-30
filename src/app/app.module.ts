import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './@core/modules/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { TorrentsService } from './@core/services/torrents.service';
import { AppComponent } from './app.component';

import { TorrentsModule } from './torrents/torrents.module';
import { TorrentDetailsModule } from './torrent-details/torrent-details.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,

    TorrentsModule,
    TorrentDetailsModule,
  ],
  providers: [TorrentsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

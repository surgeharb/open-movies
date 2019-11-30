import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TorrentsService } from './@core/services/torrents.service';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './@core/modules/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { TorrentsModule } from './torrents/torrents.module';
import { TorrentsComponent } from './torrents/torrents.component';

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
  ],
  providers: [TorrentsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

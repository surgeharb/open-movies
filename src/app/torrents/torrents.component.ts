import { Component, OnInit } from '@angular/core';
import { TorrentsService } from '../@core/services/torrents.service';
import { ITorrent } from '../@core/interfaces/torrent';
import { Spinner } from '../@core/models/spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-torrents',
  templateUrl: './torrents.component.html',
  styleUrls: ['./torrents.component.scss']
})
export class TorrentsComponent implements OnInit {

  private page = 1;

  private sub: Subscription;
  public torrents: ITorrent[] = [];
  public fetching: Boolean = false;
  public spinner: Spinner = new Spinner();

  constructor(
    private torrentsService: TorrentsService,
  ) { }

  ngOnInit() {
    this.sub = this.torrentsService.torrents.subscribe((value: ITorrent[]) => {
      this.torrents = value;

      if (this.torrentsService.lastTorrent) {
        this.torrentsService.lastTorrent = false;
      }
    });

    if (!this.torrents || !this.torrents.length) {
      this.getTorrents();
    }
  }

  getTorrents() {
    this.spinner.$loading = true;
    this.torrents = this.torrentsService.$torrents;

    this.torrentsService.getHomePageTorrents().subscribe(response => {
      this.torrentsService.$torrents = response.MovieList;
      this.spinner.$loading = false;
    });
  }

  loadMoreTorrents() {
    if (!this.fetching) {
      this.fetching = true;
      this.page = this.page + 1;

      this.torrentsService.loadMore(this.page).subscribe(response => {
        let resultMovies = this.torrentsService.$torrents.concat(response.MovieList);
        this.torrentsService.$torrents = resultMovies;
        setTimeout(() => {
          this.fetching = false;
        }, 500);
      });
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}

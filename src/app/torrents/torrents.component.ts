import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { ITorrent } from '../@core/interfaces/torrent';
import { Spinner } from '../@core/models/spinner';
import { DOCUMENT } from '@angular/common';
import { TorrentsService } from '../@core/services/torrents.service';

const componentSelector = 'app-torrents';

@Component({
  selector: componentSelector,
  templateUrl: './torrents.component.html',
  styleUrls: ['./torrents.component.scss']
})
export class TorrentsComponent implements OnInit {

  private sub;
  private page = 1;
  private torrents;

  movies: ITorrent[] = [];
  fetching: Boolean = false;
  spinner: Spinner = new Spinner();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private torrentsService: TorrentsService,
  ) { }

  ngOnInit() {
    let scrollTrack = this.torrentsService.$scrollTrack;
    this.torrents = this.document.body.getElementsByTagName(componentSelector)[0];

    this.sub = this.torrentsService.movies
      .subscribe((value: ITorrent[]) => {
        this.movies = value;
        if (this.torrentsService.lastMovie) {
          this.torrentsService.lastMovie = false;
          setTimeout(() => {
            this.torrents.scrollBy(0, scrollTrack);
          });
        }
      });

    if (!this.movies || !this.movies.length) {
      this.getMovies();
    }
  }

  getMovies() {
    let self = this;
    self.spinner.$loading = true;

    this.movies = this.torrentsService.$movies;
    this.torrentsService.getHomePageMovies().subscribe(response => {
      this.torrentsService.$movies = response.MovieList;
      self.spinner.$loading = false;
    });
  }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    let scrollView = this.torrents;
    let scrollBotPos = scrollView.scrollHeight - scrollView.scrollTop;

    this.torrentsService.$scrollTrack = scrollView.scrollTop;

    if (scrollBotPos < 2500 && !this.fetching) {
      this.fetching = true;
      this.page = this.page + 1;
      this.torrentsService.loadMore(this.page).subscribe(response => {
        let resultMovies = this.torrentsService.$movies.concat(response.MovieList);
        this.torrentsService.$movies = resultMovies;
        setTimeout(() => {
          this.fetching = false;
        }, 1000);
      });
    }

  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}

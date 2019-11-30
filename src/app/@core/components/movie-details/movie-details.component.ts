import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { Spinner } from '../../models/spinner';
import { ITorrent } from '../../interfaces/torrent';
import { TorrentsService } from '../../services/torrents.service';

@Component({
  selector: 'movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
  providers: []
})

export class MovieDetailsComponent implements OnInit, OnDestroy {

  private sub: any;
  private id: number;

  trailer = '';
  movie: ITorrent = {};
  spinner: Spinner = new Spinner();
  crawler = 'https://smart-crawler.herokuapp.com';

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private moviesService: TorrentsService,
  ) { }

  getItemSize(bytes: number) {
    let gegaBytes = bytes / 1e9;
    return Math.round(gegaBytes * 100) / 100;
  }

  sanitizeResourceUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {
    this.spinner.$loading = true;
    this.movie = this.moviesService.$currentMovie;

    if (!this.movie.id) {
      this.sub = this.route.params.subscribe(params => {
        this.id = params['id'];

        this.moviesService.getMovieDetails(`${this.id}`).subscribe((response) => {
          this.movie = response;
          this.spinner.$loading = false;
          this.moviesService.lastMovie = true;
          this.moviesService.$currentMovie = response;

          let trailer = this.movie.trailer;
          let options = 'autoplay=1&showinfo=0&controls=0&rel=0';
          this.trailer = `https://youtube.com/embed/${trailer}?${options}`;
        });
      });
    } else {
      this.spinner.$loading = false;
      this.moviesService.lastMovie = true;
    }

    this.movie.description = decodeURI(this.movie.description);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.moviesService.$currentMovie = {};
    this.moviesService.$movieDetailed = false;
  }

}

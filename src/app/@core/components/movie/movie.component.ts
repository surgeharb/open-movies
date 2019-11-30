import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { TorrentsService } from '../../services/torrents.service';
import { ITorrent } from '../../interfaces/torrent';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
  providers: []
})

export class MovieComponent implements OnInit {

  movie: ITorrent;

  @Input() details: ITorrent;

  constructor(
    private router: Router,
    private moviesService: TorrentsService,
  ) { }

  ngOnInit() {
    this.movie = this.details;
  }

  moreDetails(route) {
    this.moviesService.$currentMovie = this.movie;
    this.router.navigate([`movies/${route}`]);
  }

}

import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { TorrentsService } from '../../services/torrents.service';
import { ITorrent } from '../../interfaces/torrent';

@Component({
  selector: 'app-single-torrent',
  templateUrl: './torrent.component.html',
  styleUrls: ['./torrent.component.scss'],
  providers: []
})

export class SingleTorrentComponent implements OnInit {

  public torrent: ITorrent;

  public defaultImage = '/assets/images/poster-placeholder.png';

  @Input() details: ITorrent;

  constructor(
    private router: Router,
    private torrentsService: TorrentsService,
  ) { }

  ngOnInit() {
    this.torrent = this.details;
  }

  moreDetails(route: string) {
    this.torrentsService.$currentTorrent = this.torrent;
    this.router.navigate([`torrents/${route}`]);
  }

}

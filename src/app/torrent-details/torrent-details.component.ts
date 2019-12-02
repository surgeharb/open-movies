import { Component, OnInit } from '@angular/core';
import { ITorrent } from '../@core/interfaces/torrent';
import { Spinner } from '../@core/models/spinner';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { TorrentsService } from '../@core/services/torrents.service';

@Component({
  selector: 'app-torrent-details',
  templateUrl: './torrent-details.component.html',
  styleUrls: ['./torrent-details.component.scss']
})
export class TorrentDetailsComponent implements OnInit {


  private sub: any;
  private id: number;

  trailer = '';
  torrent: ITorrent = {};
  spinner: Spinner = new Spinner();

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private torrentsService: TorrentsService,
  ) { }

  public sanitizeResourceUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public getItemLink(item: any) {
    return this.sanitizeResourceUrl(item.torrent_url || item.torrent_magnet);
  }

  public getItemSize(bytes: number) {
    let gegaBytes = bytes / 1e9;
    return Math.round(gegaBytes * 100) / 100;
  }

  ngOnInit() {
    this.torrent = this.torrentsService.$currentTorrent;
    this.spinner.$loading = !this.torrent;

    if (!this.sub) {
      this.sub = this.route.params.subscribe(params => {
        this.id = params['id'];

        if (!this.id) { return false; }
  
        this.torrentsService.getTorrentDetails(`${this.id}`).subscribe((response) => {
          this.torrent = response.MovieList[0];
          this.spinner.$loading = false;
          this.torrentsService.lastTorrent = true;
          this.torrentsService.$currentTorrent = { ...this.torrent };
  
          this.trailer = `https://youtube.com/embed/${this.torrent.trailer}`;
        });
      });
  
      this.torrent.description = decodeURI(this.torrent.description);
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.torrentsService.$currentTorrent = {};
    this.torrentsService.$torrentDetailed = false;
  }

}

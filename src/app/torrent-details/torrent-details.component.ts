import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { ITorrent, ISeason } from '../@core/interfaces/torrent';
import { Spinner } from '../@core/models/spinner';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { TorrentsService } from '../@core/services/torrents.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-torrent-details',
  templateUrl: './torrent-details.component.html',
  styleUrls: ['./torrent-details.component.scss'],
})
export class TorrentDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('iframe', { static: false }) iframe: ElementRef;

  private sub: any;
  private id: number;

  public torrentType = 'movie';

  public trailer = '';
  public torrent: ITorrent = {};
  public spinner: Spinner = new Spinner();

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private torrentsService: TorrentsService
  ) {}

  public sanitizeResourceUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public getItemLink(item: any) {
    return this.sanitizeResourceUrl(item.torrent_url || item.torrent_magnet);
  }

  public getItemSize(bytes: number) {
    const gegaBytes = bytes / 1e9;
    return Math.round(gegaBytes * 100) / 100;
  }

  handleTorrent(response) {
    this.torrent = response;
    this.torrentsService.lastTorrent = true;
    this.torrentsService.$currentTorrent = { ...this.torrent };

    if (!this.torrent) {
      return false;
    }

    this.torrent.description = decodeURI(this.torrent.description);

    this.trailer = `https://youtube.com/embed/${this.torrent.trailer}`;

    this.iframe.nativeElement.contentWindow.location.replace(this.trailer);

    if (!this.torrent.items.length) {
      this.torrentType = 'show';

      this.torrentsService
        .getShowDataItems(this.torrent.imdb)
        .pipe(take(1))
        .subscribe((response) => {
          const formatSeasons = (season: any) => ({
            episodes: season,
            number: +season[0].season,
          });
          this.torrent.seasons = Object.values(response).map(formatSeasons);
        });
    }

    this.spinner.$loading = false;
    return true;
  }

  ngOnInit() {
    this.torrent = this.torrentsService.$currentTorrent;
    this.spinner.$loading = !this.torrent;

    if (!this.sub) {
      this.sub = this.route.params.subscribe((params) => {
        this.id = params.id;

        if (!this.id) {
          return false;
        }

        this.torrentsService
          .getTorrentDetails(`${this.id}`)
          .pipe(take(1))
          .subscribe((response) => {
            const result = this.handleTorrent(response);

            if (!result) {
              this.spinner.$loading = true;
              this.torrentsService.$torrentsListType = 'series';
              this.torrentsService
                .getTorrentDetails(`${this.id}`)
                .pipe(take(1))
                .subscribe((response) => {
                  this.handleTorrent(response);
                });
            }
          });
      });
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.torrentsService.$currentTorrent = null;
  }
}

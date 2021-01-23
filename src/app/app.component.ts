import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TorrentsService } from './@core/services/torrents.service';
import { ITorrentResponse, ITorrent } from './@core/interfaces/torrent';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  @ViewChild('search', { static: false }) searchInput: ElementRef;

  public searchBar = {
    opened: false,
    input: ''
  };

  public inDetails = false;
  public currentTorrent: ITorrent;

  public searchTerm$ = new BehaviorSubject<string>(null);

  public torrentsListType = 'Movies';

  private subscriptions = [];
  private firstTime = true;

  constructor(
    private readonly router: Router,
    private readonly torrentsService: TorrentsService,
  ) {
    this.subscriptions.push(
      this.torrentsService.search(this.searchTerm$).subscribe(this.getSearchResults.bind(this))
    );

    this.subscriptions.push(
      this.torrentsService.currentTorrent.subscribe((torrent: ITorrent) => {
        this.currentTorrent = torrent;
        this.inDetails = !!torrent;
      })
    );

    this.subscriptions.push(
      this.router.events.subscribe((val) => {
        if (val instanceof NavigationEnd) {
          if (!this.firstTime && this.searchTerm$.getValue()) {
            this.toggleSearch();
          }

          this.firstTime = false;
        }
      })
    );
  }

  ngOnInit() {
    if (this.torrentsService.$torrentsListType === 'series' && this.torrentsListType.toLowerCase() !== this.torrentsService.$torrentsListType) {
      this.changeTorrentType('series');
    }
  }

  private async getSearchResults(results: Promise<ITorrentResponse>) {
    this.torrentsService.$torrents = (await results).MovieList;
  }

  public toggleSearch(forceValue?: boolean) {

    if (forceValue !== undefined) {

      if (this.searchBar.opened === forceValue) {
        return;
      }

      this.searchBar.opened = forceValue;

      if (forceValue === false && this.searchTerm$.getValue() == this.searchBar.input) {
        this.searchBar.input = '';
        this.searchTerm$.next('');
      }

    } else {
      this.searchBar.opened = !this.searchBar.opened;
    }

    if (this.searchBar.opened) {
      this.searchInput.nativeElement.focus();
    }
  }

  public changeTorrentType(type: 'movies' | 'series') {
    this.torrentsService.$torrentsListType = type;
    this.torrentsListType = `${type.charAt(0).toUpperCase()}${type.substr(1)}`;

    this.searchTerm$.next('');
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription =>
      subscription.unsubscribe(),
    );
  }

}

import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TorrentsService } from './@core/services/torrents.service';
import { ITorrentResponse } from './@core/interfaces/torrent';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';

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
  public searchTerm$ = new Subject<string>();

  private subscriptions = [];

  constructor(
    private readonly router: Router,
    private readonly _location: Location,
    private readonly torrentsService: TorrentsService,
  ) {
    this.subscriptions.push(
      this.torrentsService.search(this.searchTerm$).subscribe(this.getSearchResults.bind(this))
    );

    this.subscriptions.push(
      this.torrentsService.torrentDetailed.subscribe((value: boolean) => {
        this.inDetails = value;
      })
    );

    this.subscriptions.push(
      this.router.events.subscribe((val) => {
        if (val instanceof NavigationEnd) {
          this.toggleSearch(false);
        }
      })
    );
  }

  ngOnInit() { }

  private async getSearchResults(results: Promise<ITorrentResponse>) {
    this.torrentsService.$torrents = (await results).MovieList;
  }

  public toggleSearch(forceValue?: boolean) {
    this.searchBar.opened = !this.searchBar.opened;

    if (forceValue !== undefined) {
      this.searchBar.opened = forceValue;
    }

    if (this.searchBar.opened) {
      this.searchInput.nativeElement.focus();
    } else {
      this.searchBar.input = '';
      this.searchTerm$.next('');
    }
  }

  public getBack() {
    this._location.back();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription =>
      subscription.unsubscribe(),
    );
  }

}

import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { TorrentsService } from './@core/services/torrents.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public inDetails = false;
  public searchTerm$ = new Subject<string>();

  public sideNav = {
    mode: 'side',
    opened: false
  }

  public searchBar = {
    opened: false,
    input: ''
  }

  constructor(
    private moviesService: TorrentsService,
  ) {
    this.moviesService.search(this.searchTerm$)
      .subscribe(async results => {
        let list = (await results).MovieList;
        this.moviesService.$movies = list;
      });

    this.moviesService.movieDetailed
      .subscribe((value: boolean) => {
        this.inDetails = value;
      });
  }

  @ViewChild('search', { static: false }) searchInput: ElementRef;

  ngOnInit() { }

  toggleSearch() {
    this.searchBar.opened = !this.searchBar.opened;
    if (this.searchBar.opened) {
      this.searchInput.nativeElement.focus();
    } else {
      this.searchBar.input = '';
      this.searchTerm$.next('');
    }
  }

  private checkSideNavMode(event) {
    if (event.currentTarget.innerWidth < 900) {
      this.sideNav.mode = 'over';
      this.sideNav.opened = false;
    } else {
      this.sideNav.mode = 'side';
      this.sideNav.opened = false;
    }
  }

  @HostListener('window:load', ['$event'])
  onLoad(event) {
    this.checkSideNavMode(event);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkSideNavMode(event);
  }

}

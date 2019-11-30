
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { IPosterResponse } from '../interfaces/poster';
import { ITorrent, ITorrentResponse } from '../interfaces/torrent';

@Injectable()
export class TorrentsService {

  public scrollTrack = 0;
  public lastMovie = false;
  public movies = new BehaviorSubject(null);
  public movieDetailed = new BehaviorSubject(null);

  private currentMovie: ITorrent = {};
  private infoUrl = 'https://tinfo.ukfrnlge.xyz/3/movie';
  private baseUrl = 'https://api.ukfrnlge.xyz/list?sort=seeds&cb=&quality=720p,1080p,3d';

  constructor(
    private httpClient: HttpClient,
  ) { }

  private tempKeywords = ''; // temp keywords for loadMore

  private getUrl(keywords?: string, page?: Number): string {
    if (!page) {
      page = 1;
    }

    if (!keywords) {
      keywords = '';
    }

    return this.baseUrl + '&page=' + page + '&keywords=' + keywords;
  }

  public get $movies(): ITorrent[] {
    return this.movies.value;
  }

  public set $movies(value: ITorrent[]) {
    this.movies.next(value);
  }

  public get $movieDetailed(): boolean {
    return this.movieDetailed.value;
  }

  public set $movieDetailed(value: boolean) {
    this.movieDetailed.next(value);
  }

  public get $currentMovie(): ITorrent {
    return this.currentMovie;
  }

  public set $currentMovie(movie: ITorrent) {
    if (!movie.id) {
      this.$movieDetailed = false;
    } else {
      this.$movieDetailed = true;
    }

    this.currentMovie = movie;
  }

  public get $scrollTrack(): number {
    return this.scrollTrack;
  }

  public set $scrollTrack(value: number) {
    this.scrollTrack = value;
  }

  public search(terms: Observable<any>) {
    return terms.pipe(
      map(i => this.searchEntries(i.currentTarget.value)),
      debounceTime(400)
    )
  }

  private async searchEntries(term: string): Promise<ITorrentResponse> {
    this.tempKeywords = term;

    return this.httpClient.get<ITorrentResponse>(this.getUrl(term)).toPromise();
  }

  public loadMore(page: Number): Observable<ITorrentResponse> {
    return this.httpClient.get<ITorrentResponse>(this.getUrl(this.tempKeywords, page));
  }

  public getHomePageMovies = (): Observable<ITorrentResponse> => {
    return this.httpClient.get<ITorrentResponse>(this.baseUrl);
  }

  public getMovieDetails = (id: string): Observable<ITorrent> => {
    return this.httpClient.get<ITorrent>(this.getUrl(id));
  }

  public getMovieMoreDetails = (id: string) => {
    return this.httpClient.get(`${this.infoUrl}/${id}?api_key=6b6effafe7c0b6fa17191d0430f546f8`);
  }

  public getMoviePosters = (id: string): Observable<IPosterResponse> => {
    return this.httpClient.get(`${this.infoUrl}/${id}/images?api_key=6b6effafe7c0b6fa17191d0430f546f8`);
  }

}

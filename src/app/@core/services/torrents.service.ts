
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, filter } from 'rxjs/operators';

import { ITorrent, ITorrentResponse } from '../interfaces/torrent';

@Injectable()
export class TorrentsService {

  public lastTorrent = false;
  public torrents = new BehaviorSubject(null);
  public currentTorrent = new BehaviorSubject(null);

  private torrentsListType = 'movies';
  private baseUrl = 'https://api.ukfrnlge.xyz';

  constructor(
    private httpClient: HttpClient,
  ) { }

  private tempKeywords = ''; // temp keywords for loadMore

  private getUrl(keywords = '', page = 1) {
    const params = 'sort=seeds&cb=&quality=720p,1080p,3d';
    const torrentsType = this.torrentsListType === 'movies' ? 'list' : 'shows';
    return `${this.baseUrl}/${torrentsType}?${params}&page=${page}&keywords=${keywords}`;
  }

  private getSingleShowUrl(imdbId: string) {
    return `${this.baseUrl}/show?imdb=${imdbId}`;
  }

  public set $torrentsListType(type: 'movies' | 'series') {
    this.torrentsListType =
      type === 'movies' ? 'movies' : 'series';
  }

  public get $torrents(): ITorrent[] {
    return this.torrents.value;
  }

  public set $torrents(value: ITorrent[]) {
    this.torrents.next(value);
  }

  public get $currentTorrent(): ITorrent {
    return this.currentTorrent.value;
  }

  public set $currentTorrent(torrent: ITorrent) {
    this.currentTorrent.next(torrent);
  }

  public search(terms: Observable<any>) {
    return terms.pipe(
      debounceTime(400),
      filter(val => val !== undefined),
      map(this.searchEntries.bind(this)),
    )
  }

  private async searchEntries(term: string): Promise<ITorrentResponse> {
    this.tempKeywords = term;

    return this.httpClient.get<ITorrentResponse>(this.getUrl(term)).toPromise();
  }

  public loadMore(page: number): Observable<ITorrentResponse> {
    return this.httpClient.get<ITorrentResponse>(this.getUrl(this.tempKeywords, page));
  }

  public getHomePageTorrents = (): Observable<ITorrentResponse> => {
    return this.httpClient.get<ITorrentResponse>(this.getUrl());
  }

  public getTorrentDetails = (id: string): Observable<ITorrentResponse> => {
    return this.httpClient.get<ITorrentResponse>(this.getUrl(id));
  }

  public getShowDataItems = (imdbId: string): Observable<Object> => {
    return this.httpClient.get<Object>(this.getSingleShowUrl(imdbId));
  }

}

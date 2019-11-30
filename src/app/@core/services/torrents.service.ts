
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, filter, distinctUntilChanged, tap } from 'rxjs/operators';

import { IPosterResponse } from '../interfaces/poster';
import { ITorrent, ITorrentResponse } from '../interfaces/torrent';

@Injectable()
export class TorrentsService {

  public lastTorrent = false;
  public torrents = new BehaviorSubject(null);
  public torrentDetailed = new BehaviorSubject(null);

  private currentTorrent: ITorrent = {};
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

  public get $torrents(): ITorrent[] {
    return this.torrents.value;
  }

  public set $torrents(value: ITorrent[]) {
    this.torrents.next(value);
  }

  public get $torrentDetailed(): boolean {
    return this.torrentDetailed.value;
  }

  public set $torrentDetailed(value: boolean) {
    this.torrentDetailed.next(value);
  }

  public get $currentTorrent(): ITorrent {
    return this.currentTorrent;
  }

  public set $currentTorrent(torrent: ITorrent) {
    if (!torrent.id) {
      this.$torrentDetailed = false;
    } else {
      this.$torrentDetailed = true;
    }

    this.currentTorrent = torrent;
  }

  public search(terms: Observable<any>) {
    return terms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(this.searchEntries.bind(this)),
    )
  }

  private async searchEntries(term: string): Promise<ITorrentResponse> {
    this.tempKeywords = term;

    return this.httpClient.get<ITorrentResponse>(this.getUrl(term)).toPromise();
  }

  public loadMore(page: Number): Observable<ITorrentResponse> {
    return this.httpClient.get<ITorrentResponse>(this.getUrl(this.tempKeywords, page));
  }

  public getHomePageTorrents = (): Observable<ITorrentResponse> => {
    return this.httpClient.get<ITorrentResponse>(this.baseUrl);
  }

  public getTorrentDetails = (id: string): Observable<ITorrentResponse> => {
    return this.httpClient.get<ITorrentResponse>(this.getUrl(id));
  }

  public getTorrentMoreDetails = (id: string) => {
    return this.httpClient.get(`${this.infoUrl}/${id}?api_key=6b6effafe7c0b6fa17191d0430f546f8`);
  }

  public getTorrentPosters = (id: string): Observable<IPosterResponse> => {
    return this.httpClient.get(`${this.infoUrl}/${id}/images?api_key=6b6effafe7c0b6fa17191d0430f546f8`);
  }

}

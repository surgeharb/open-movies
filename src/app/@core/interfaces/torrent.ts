import { IItem } from './item';

export interface ISeason {
  number: number;
  episodes: [{ title: string, items: [IItem] }];
}

export interface ITorrent {
  id?: string;
  title?: string;
  year?: Number;
  rating?: Number;
  imdb?: string;
  actors?: string;
  writers?: string;
  directors?: string;
  trailer?: string;
  trailerUrl?: any;
  description?: string;
  poster_med?: string;
  poster_big?: string;
  popularity?: string;
  genres?: [string];
  items?: [IItem];
  items_lang?: [IItem];

  seasons?: ISeason[];
}

export interface ITorrentResponse {
  MovieList: ITorrent[];
}
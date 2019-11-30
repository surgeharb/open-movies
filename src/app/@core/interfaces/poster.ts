export interface IPoster {
  aspect_ratio?: number;
  file_path?: string;
  height?: number;
  iso_639_1?: any;
  vote_average?: number;
  vote_count?: number;
  width?: number;
}

export interface IPosterResponse {
  id?: number;
  backdrops?: [IPoster];
}

export interface AnimeTypeOption {
  label: string;
  value: string;
}

export interface GenreOption {
  mal_id: number;
  name: string;
}

export interface AnimeGenresResponse {
  data: GenreOption[];
}

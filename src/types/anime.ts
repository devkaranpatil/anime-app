export interface AnimeImage {
  image_url?: string;
  small_image_url?: string;
  large_image_url?: string;
}

export interface AnimeImages {
  jpg: AnimeImage;
  webp?: AnimeImage;
}

export interface AnimeGenre {
  mal_id: number;
  name: string;
}

export interface AnimeStudio {
  mal_id: number;
  name: string;
}

export interface RecentlyViewedAnime {
  mal_id: number;
  title: string;
  image: string;
  score: number;
}

export interface Anime {
  mal_id?: number;
  title?: string;
  title_english?: string;
  title_japanese?: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  episodes?: number;
  duration?: string;
  status?: string;
  aired?: { string?: string };
  season?: string;
  year?: number;
  rating?: string;
  synopsis?: string;
  background?: string;
  images?: AnimeImages;
  genres?: AnimeGenre[];
  studios?: AnimeStudio[];
  type?: string;
  source?: string;
  favorites?: number;
  has_next_page?: boolean;
  last_visible_page?: number;
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface PaginatedResponse<T> {
  pagination: Pagination;
  data: T[];
}

export interface VideoDetail {
  mal_id?: number;
  title?: string;
  episode?: string;
  url?: string;
  images?: {
    jpg?: {
      image_url?: string;
    };
  };
}

export interface VideoData {
  promo?: VideoDetail[];
  episodes?: VideoDetail[];
}

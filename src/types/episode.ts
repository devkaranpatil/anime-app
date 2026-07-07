export interface Episode {
  mal_id: number;
  title?: string;
  title_japanese?: string;
  aired?: string;
  score?: number;
  filler?: boolean;
  recap?: boolean;
  forum_url?: string;
}

export interface EpisodeDetail {
  mal_id: number;
  title?: string;
  title_japanese?: string;
  title_romanji?: string;
  aired?: string;
  score?: number;
  synopsis?: string;
  filler?: boolean;
  recap?: boolean;
}

export interface StreamingLink {
  name: string;
  url: string;
}

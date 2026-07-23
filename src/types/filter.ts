import type { AnimeTypeValue } from "./animeTypes";

export interface AnimeFilters {
  genres: number[];
  type: AnimeTypeValue;
}

export const defaultAnimeFilters: AnimeFilters = {
  genres: [],
  type: "all",
};

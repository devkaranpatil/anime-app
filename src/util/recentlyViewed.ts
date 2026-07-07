import type { Anime } from "../types/anime";

const STORAGE_KEY = "recentlyViewed";
const MAX_ITEMS = 10;

export function addRecentlyViewed(anime: Anime) {
  const stored = localStorage.getItem(STORAGE_KEY);

  const recent: Anime[] = stored ? JSON.parse(stored) : [];

  const filtered = recent.filter((item) => item.mal_id !== anime.mal_id);

  filtered.unshift(anime);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(filtered.slice(0, MAX_ITEMS)),
  );
}

export function getRecentlyViewed(): Anime[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  return stored ? JSON.parse(stored) : [];
}

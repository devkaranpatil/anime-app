export type AnimeTypeValue =
  | "all"
  | "tv"
  | "movie"
  | "ova"
  | "special"
  | "ona"
  | "music";

export interface AnimeTypeOption {
  value: AnimeTypeValue;
  label: string;
}

export const defaultAnimeTypeOptions: AnimeTypeOption[] = [
  { value: "all", label: "All types" },
  { value: "tv", label: "TV" },
  { value: "movie", label: "Movie" },
  { value: "ova", label: "OVA" },
  { value: "special", label: "Special" },
  { value: "ona", label: "ONA" },
  { value: "music", label: "Music" },
];

export const animeTypeLabels: Record<AnimeTypeValue, string> = {
  all: "All types",
  tv: "TV",
  movie: "Movie",
  ova: "OVA",
  special: "Special",
  ona: "ONA",
  music: "Music",
};

export const getAnimeTypeLabel = (value: AnimeTypeValue | null | undefined) => {
  if (!value) {
    return animeTypeLabels.all;
  }

  return animeTypeLabels[value] ?? value;
};

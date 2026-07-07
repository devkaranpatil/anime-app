import axios, { type AxiosError } from "axios";
import type {
  Anime,
  AnimeGenresResponse,
  PaginatedResponse,
} from "../types/anime";
import {
  defaultAnimeTypeOptions,
  type AnimeTypeOption,
  type AnimeTypeValue,
} from "../types/animeTypes";
import type { Episode, EpisodeDetail, StreamingLink } from "../types/episode";
import type { VideoData } from "../types/video";

const api = axios.create({
  baseURL: "https://api.jikan.moe/v4",
  timeout: 10000,
});

function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}

function getRetryDelay(error: AxiosError, retries: number) {
  const retryAfter = error.response?.headers?.["retry-after"];

  if (retryAfter) {
    const parsedSeconds = Number(retryAfter);
    if (!Number.isNaN(parsedSeconds)) {
      return parsedSeconds * 1000;
    }

    const parsedDate = Date.parse(retryAfter);
    if (!Number.isNaN(parsedDate)) {
      return Math.max(1000, parsedDate - Date.now());
    }
  }

  const attempt = 4 - retries;
  return 500 * 2 ** Math.max(0, attempt - 1);
}

async function requestWithRetry<T>(
  request: () => Promise<T>,
  retries = 3,
): Promise<T> {
  try {
    return await request();
  } catch (error) {
    const isTransientFailure = isAxiosError(error)
      ? error.code === "ECONNABORTED" ||
        error.message.includes("timeout") ||
        [429, 502, 503, 504].includes(error.response?.status ?? 0)
      : false;

    if (retries > 0 && isTransientFailure && isAxiosError(error)) {
      const delay = getRetryDelay(error, retries);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return requestWithRetry(request, retries - 1);
    }

    throw error;
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return "The anime service took too long to respond. Please try again.";
    }

    if (
      error.response?.status &&
      [502, 503, 504].includes(error.response.status)
    ) {
      return "The anime service is temporarily unavailable. Please try again shortly.";
    }

    if (error.response?.status === 404) {
      return "No anime found for that search.";
    }

    return (
      (error.response?.data as { message?: string } | undefined)?.message ||
      error.message ||
      "Something went wrong"
    );
  }

  return "Something went wrong";
}

export async function getAnimeGenres(): Promise<AnimeGenresResponse["data"]> {
  const response = await requestWithRetry(() =>
    api.get<AnimeGenresResponse>("/genres/anime"),
  );
  return response.data.data;
}

export async function getAnimeTypes(): Promise<AnimeTypeOption[]> {
  try {
    const response = await requestWithRetry(() =>
      api.get<{ data: Array<{ type: AnimeTypeValue }> }>("/meta/anime/types"),
    );

    const fetchedTypes = (response.data.data ?? []).map((item) => ({
      value: item.type,
      label: item.type.toUpperCase(),
    }));

    return fetchedTypes.length > 0 ? fetchedTypes : defaultAnimeTypeOptions;
  } catch (error) {
    return defaultAnimeTypeOptions;
  }
}

export async function getTopAnime(
  page = 1,
  limit = 24,
): Promise<PaginatedResponse<Anime>> {
  const response = await requestWithRetry(() =>
    api.get<PaginatedResponse<Anime>>("/top/anime", {
      params: {
        page,
        limit,
      },
    }),
  );

  return response.data;
}

export async function searchAnime(
  query: string,
  page = 1,
  limit = 25,
): Promise<PaginatedResponse<Anime>> {
  const response = await requestWithRetry(() =>
    api.get<PaginatedResponse<Anime>>("/anime", {
      params: {
        q: query,
        page,
        limit,
      },
    }),
  );

  return response.data;
}

export async function getAnimeById(id: number): Promise<Anime> {
  const response = await requestWithRetry(() => api.get(`/anime/${id}/full`));
  return response.data.data;
}

export async function getAnimeEpisodes(
  id: number,
  page = 1,
): Promise<{ episodes: Episode[]; hasNextPage: boolean }> {
  const response = await requestWithRetry(() =>
    api.get(`/anime/${id}/episodes`, { params: { page } }),
  );
  return {
    episodes: response.data.data,
    hasNextPage: response.data.pagination?.has_next_page ?? false,
  };
}

export async function getEpisodeVideo(id: number): Promise<VideoData> {
  const response = await requestWithRetry(() => api.get(`/anime/${id}/videos`));
  return response.data.data;
}

export async function getEpisodeDetail(
  animeId: number,
  episode: number,
): Promise<EpisodeDetail> {
  const response = await requestWithRetry(() =>
    api.get(`/anime/${animeId}/episodes/${episode}`),
  );
  return response.data.data;
}

export async function getStreamingLinks(id: number): Promise<StreamingLink[]> {
  const response = await api.get(`/anime/${id}/streaming`);

  return response.data.data;
}

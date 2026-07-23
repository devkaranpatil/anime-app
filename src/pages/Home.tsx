import { useEffect, useState } from "react";
import type { Anime } from "../types/anime";
import {
  getApiErrorMessage,
  getTopAnime,
  searchAnime,
} from "../services/animeApi";
import AnimeGrid from "../components/AnimeGrid/AnimeGrid";
import Pagination from "../components/Pagination/Pagination";
import HeroCarousel from "../components/HeroCarousel/HeroCarousel";
import FilterBar from "../components/FilterBar/FilterBar";
import { useSearch } from "../context/SearchContext";
import "../styles/HeroCarousel.css";

const Home = () => {
  const [featuredAnime, setFeaturedAnime] = useState<Anime[]>([]);
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [lastPage, setLastPage] = useState(1);

  const heroAnime = featuredAnime.slice(0, 5);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const { submittedSearch } = useSearch();

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAnime() {
      setLoading(true);
      setError("");

      try {
        let response;

        if (submittedSearch) {
          response = await searchAnime(
            submittedSearch,
            page,
            limit,
            controller.signal,
          );
        } else {
          response = await getTopAnime(page, limit);
          if (page === 1) {
            setFeaturedAnime(response.data.slice(0, 5));
          }
        }

        if (!controller.signal.aborted) {
          setAnime(response.data);
          setLastPage(response.pagination.last_visible_page);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(error));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchAnime();

    return () => controller.abort();
  }, [page, limit, submittedSearch]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page, limit]);

  return (
    <section>
      {!loading && !error && heroAnime.length > 0 && (
        <HeroCarousel anime={heroAnime} />
      )}

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && submittedSearch && anime.length === 0 && (
        <p>No anime matched “{submittedSearch}”. Try a different title.</p>
      )}

      {!loading && !error && (
        <>
          <FilterBar />
          <AnimeGrid anime={anime} />

          <Pagination
            page={page}
            lastPage={lastPage}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
          />
        </>
      )}
    </section>
  );
};

export default Home;

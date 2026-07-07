import { useEffect, useRef, useState } from "react";
import { getAnimeGenres } from "../../services/animeApi";
import type { AnimeGenre } from "../../types/anime";
import "../../styles/FilterBar.css";

const FilterBar = () => {
  const [genres, setGenres] = useState<AnimeGenre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isGenreMenuOpen, setIsGenreMenuOpen] = useState(false);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [genreError, setGenreError] = useState("");
  const genreMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadGenres() {
      try {
        setLoadingGenres(true);
        setGenreError("");
        const fetchedGenres = await getAnimeGenres();

        if (isMounted) {
          setGenres(fetchedGenres);
        }
      } catch (error) {
        if (isMounted) {
          setGenreError("Unable to load genres right now.");
        }
      } finally {
        if (isMounted) {
          setLoadingGenres(false);
        }
      }
    }

    loadGenres();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        genreMenuRef.current &&
        !genreMenuRef.current.contains(event.target as Node)
      ) {
        setIsGenreMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleGenre = (malId: number) => {
    setSelectedGenres((current) =>
      current.includes(malId)
        ? current.filter((item) => item !== malId)
        : [...current, malId],
    );
  };

  return (
    <section className="filter-bar" aria-label="Anime filters">
      <div className="filter-bar__header">
        <div>
          <p className="filter-bar__eyebrow">Discover anime</p>
          <h2>Filter by genre</h2>
        </div>
        <button
          type="button"
          className="filter-bar__toggle"
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? "Hide" : "Show"}
        </button>
      </div>

      {isExpanded && (
        <div className="filter-bar__panel">
          <div className="filter-bar__section">
            <h3>Genres</h3>
            <div className="filter-bar__dropdown" ref={genreMenuRef}>
              <button
                type="button"
                className="filter-bar__dropdown-trigger"
                onClick={() => setIsGenreMenuOpen((current) => !current)}
              >
                <span>
                  {selectedGenres.length > 0
                    ? genres
                        .filter((genre) =>
                          selectedGenres.includes(genre.mal_id),
                        )
                        .map((genre) => genre.name)
                        .join(", ")
                    : "Select genres"}
                </span>
                <span className="filter-bar__dropdown-arrow">
                  {isGenreMenuOpen ? "▴" : "▾"}
                </span>
              </button>

              {isGenreMenuOpen && (
                <div className="filter-bar__dropdown-menu">
                  {loadingGenres ? (
                    <p className="filter-bar__dropdown-empty">
                      Loading genres...
                    </p>
                  ) : genreError ? (
                    <p className="filter-bar__dropdown-empty">{genreError}</p>
                  ) : (
                    genres.map((genre) => {
                      const isActive = selectedGenres.includes(genre.mal_id);

                      return (
                        <button
                          key={genre.mal_id}
                          type="button"
                          className={`filter-bar__dropdown-item ${isActive ? "is-active" : ""}`}
                          onClick={() => toggleGenre(genre.mal_id)}
                        >
                          <span className="filter-bar__chip-check">
                            {isActive ? "✓" : "○"}
                          </span>
                          {genre.name}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="filter-bar__summary">
            <span>{selectedGenres.length} genre selected</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default FilterBar;

import { useEffect, useState } from "react";
import CustomDropdown, {
  type DropdownOption,
} from "../CustomDropdown/CustomDropdown";
import { getAnimeGenres } from "../../services/animeApi";
import type { AnimeGenre } from "../../types/anime";
import {
  defaultAnimeTypeOptions,
  getAnimeTypeLabel,
  type AnimeTypeValue,
} from "../../types/animeTypes";
import type { AnimeFilters } from "../../types/filter";
import "../../styles/FilterBar.css";

interface FilterBarProps {
  filters: AnimeFilters;
  onFiltersChange: (filters: AnimeFilters) => void;
}

const FilterBar = ({ filters, onFiltersChange }: FilterBarProps) => {
  const [genres, setGenres] = useState<AnimeGenre[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [genreError, setGenreError] = useState("");

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
      } catch {
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

  const genreOptions: DropdownOption[] = genres.map((genre) => ({
    value: genre.mal_id,
    label: genre.name,
  }));

  const handleGenresChange = (values: Array<string | number>) => {
    onFiltersChange({
      ...filters,
      genres: values.filter((value): value is number => typeof value === "number"),
    });
  };

  const handleTypeChange = (values: Array<string | number>) => {
    const type = values[0] as AnimeTypeValue | undefined;
    onFiltersChange({ ...filters, type: type ?? "all" });
  };

  return (
    <section className="filter-bar" aria-label="Anime filters">
      <div className="filter-bar__header">
        <div>
          <p className="filter-bar__eyebrow">Discover anime</p>
          <h2>Filter your list</h2>
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
            <CustomDropdown
              options={genreOptions}
              selectedValues={filters.genres}
              onChange={handleGenresChange}
              placeholder="Select genres"
              disabled={loadingGenres || Boolean(genreError)}
              emptyMessage={
                loadingGenres
                  ? "Loading genres..."
                  : genreError || "No genres available."
              }
            />
          </div>

          <div className="filter-bar__section">
            <h3>Anime type</h3>
            <CustomDropdown
              options={defaultAnimeTypeOptions}
              selectedValues={[filters.type]}
              onChange={handleTypeChange}
              placeholder="All types"
              multiple={false}
            />
          </div>

          <div className="filter-bar__summary">
            <span>{filters.genres.length} genre selected</span>
            <span>Type: {getAnimeTypeLabel(filters.type)}</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default FilterBar;

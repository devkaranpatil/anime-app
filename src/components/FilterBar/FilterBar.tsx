import { useEffect, useState } from "react";
import CustomDropdown, {
  type DropdownOption,
} from "../CustomDropdown/CustomDropdown";
import { getAnimeGenres, getAnimeTypes } from "../../services/animeApi";
import type { AnimeGenre } from "../../types/anime";
import {
  defaultAnimeTypeOptions,
  getAnimeTypeLabel,
  type AnimeTypeOption,
  type AnimeTypeValue,
} from "../../types/animeTypes";
import "../../styles/FilterBar.css";

const FilterBar = () => {
  const [genres, setGenres] = useState<AnimeGenre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedType, setSelectedType] = useState<AnimeTypeValue>("all");
  const [isExpanded, setIsExpanded] = useState(true);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [genreError, setGenreError] = useState("");
  const [animeTypeOptions, setAnimeTypeOptions] = useState<AnimeTypeOption[]>(
    defaultAnimeTypeOptions,
  );
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [typeError, setTypeError] = useState("");

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

    async function loadTypes() {
      try {
        setLoadingTypes(true);
        setTypeError("");
        const fetchedTypes = await getAnimeTypes();

        if (isMounted) {
          setAnimeTypeOptions(fetchedTypes);
        }
      } catch (error) {
        if (isMounted) {
          setTypeError("Unable to load anime types right now.");
        }
      } finally {
        if (isMounted) {
          setLoadingTypes(false);
        }
      }
    }

    loadGenres();
    loadTypes();

    return () => {
      isMounted = false;
    };
  }, []);

  const genreOptions: DropdownOption<number>[] = genres.map((genre) => ({
    value: genre.mal_id,
    label: genre.name,
  }));

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
              value={selectedGenres}
              onChange={(value) =>
                setSelectedGenres(
                  Array.isArray(value) ? (value as number[]) : [],
                )
              }
              placeholder="Select genres"
              multiple
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
              options={animeTypeOptions}
              value={selectedType}
              onChange={(value) => {
                const nextValue =
                  typeof value === "string" ? (value as AnimeTypeValue) : "all";
                setSelectedType(nextValue);
              }}
              placeholder="All types"
              disabled={loadingTypes}
              emptyMessage={
                loadingTypes
                  ? "Loading anime types..."
                  : typeError || "No anime types available."
              }
            />
          </div>

          <div className="filter-bar__summary">
            <span>{selectedGenres.length} genre selected</span>
            <span>Type: {getAnimeTypeLabel(selectedType)}</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default FilterBar;

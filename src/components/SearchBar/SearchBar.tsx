import { useEffect, useState } from "react";
import type { FormEvent, FocusEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { searchAnime } from "../../services/animeApi";
import type { Anime } from "../../types/anime";
import "../../styles/SearchBar.css";

export const SearchBar = () => {
  const { search, setSearch, submitSearch } = useSearch();
  const [suggestions, setSuggestions] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const hasSearchText = search.trim().length >= 2;
  const showSuggestions = isFocused && hasSearchText;

  useEffect(() => {
    if (!hasSearchText) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await searchAnime(search.trim(), 1, 6, controller.signal);
        if (!controller.signal.aborted) {
          setSuggestions(response.data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 400);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [search, hasSearchText]);

  const runSearch = (value = search) => {
    submitSearch(value);
    setIsFocused(false);
    navigate("/");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runSearch();
  };

  const handleBlur = (event: FocusEvent<HTMLFormElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(false);
    }
  };

  const handleChange = (value: string) => {
    setSearch(value);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  return (
    <form
      className="search-bar"
      role="search"
      onSubmit={handleSubmit}
      onBlur={handleBlur}
    >
      <input
        type="search"
        placeholder="Search anime..."
        value={search}
        aria-label="Search anime"
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
        onChange={(event) => handleChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
      />
      <button type="submit" aria-label="Search">
        Search
      </button>

      {showSuggestions && (
        <div className="search-suggestions" role="listbox">
          {isLoading ? (
            <p className="search-suggestion-status">Finding anime...</p>
          ) : suggestions.length > 0 ? (
            suggestions.map((anime) => (
              <button
                key={anime.mal_id}
                type="button"
                className="search-suggestion"
                role="option"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => runSearch(anime.title ?? search)}
              >
                {anime.images?.jpg.small_image_url && (
                  <img src={anime.images.jpg.small_image_url} alt="" />
                )}
                <span>{anime.title ?? "Untitled anime"}</span>
              </button>
            ))
          ) : (
            <p className="search-suggestion-status">No suggestions found.</p>
          )}
        </div>
      )}
    </form>
  );
};

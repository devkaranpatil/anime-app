import { useSearch } from "../../context/SearchContext";
import "../../styles/SearchBar.css";

export const SearchBar = () => {
  const { search, setSearch } = useSearch();

  return (
    <input
      type="text"
      placeholder="Search anime..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

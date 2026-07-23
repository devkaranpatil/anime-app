import { createContext, useContext, useState } from "react";

interface SearchContextType {
  search: string;
  submittedSearch: string;
  searchRequestId: number;
  setSearch: (value: string) => void;
  submitSearch: (value?: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [searchRequestId, setSearchRequestId] = useState(0);

  const submitSearch = (value = search) => {
    const query = value.trim();
    setSearch(query);
    setSubmittedSearch(query);
    setSearchRequestId((current) => current + 1);
  };

  return (
    <SearchContext.Provider
      value={{
        search,
        submittedSearch,
        searchRequestId,
        setSearch,
        submitSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }

  return context;
};

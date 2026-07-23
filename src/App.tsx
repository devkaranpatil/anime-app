import "bootstrap/dist/css/bootstrap.min.css";
import { SearchProvider, useSearch } from "./context/SearchContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import AnimeDetails from "./pages/AnimeDetails";
import EpisodeDetails from "./pages/EpisodeDetails";
import Favorites from "./pages/Favorite";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const HomeRoute = () => {
  const { searchRequestId } = useSearch();

  return <Home key={searchRequestId} />;
};

function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomeRoute />} />
            <Route path="anime/:id" element={<AnimeDetails />} />
            <Route
              path="anime/:id/episode/:episode"
              element={<EpisodeDetails />}
            />
            <Route path="favorites" element={<Favorites />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App;

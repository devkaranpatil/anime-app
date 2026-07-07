import "bootstrap/dist/css/bootstrap.min.css";
import { SearchProvider } from "./context/SearchContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import AnimeDetails from "./pages/AnimeDetails";
import EpisodeDetails from "./pages/EpisodeDetails";
import Favorites from "./pages/Favorite";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <SearchProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="anime/:id" element={<AnimeDetails />} />
            <Route
              path="anime/:id/episode/:episode"
              element={<EpisodeDetails />}
            />
            <Route path="favorites" element={<Favorites />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SearchProvider>
  );
}

export default App;

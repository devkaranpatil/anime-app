import type { Anime } from "../../types/anime";
import AnimeCard from "../AnimeCard/AnimeCard";
import "../../styles/AnimeGrid.css";

interface AnimeGridProps {
  anime: Anime[];
}

const AnimeGrid = ({ anime }: AnimeGridProps) => (
  <div className="anime-grid">
    {anime.map((item, index) => (
      <AnimeCard key={item.mal_id ?? `${item.title}-${index}`} anime={item} />
    ))}
  </div>
);

export default AnimeGrid;

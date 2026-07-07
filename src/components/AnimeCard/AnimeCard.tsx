import { Link } from "react-router-dom";
import type { Anime } from "../../types/anime";
import "../../styles/AnimeCard.css";

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  const imageUrl = anime.images?.jpg.image_url;
  const content = (
    <>
      <div className="anime-card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={anime.title ?? "Anime cover"} />
        ) : (
          <div className="anime-card-placeholder">No image</div>
        )}
      </div>
      <div className="anime-card-content">
        <h2 className="anime-title">{anime.title ?? "Untitled anime"}</h2>
        <div className="anime-info">
          <span className="anime-score"> {anime.score ?? "N/A"}</span>
        </div>
      </div>
    </>
  );

  return anime.mal_id ? (
    <Link className="anime-card" to={`/anime/${anime.mal_id}`}>
      {content}
    </Link>
  ) : (
    <article className="anime-card">{content}</article>
  );
};

export default AnimeCard;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Anime } from "../../types/anime";

interface HeroCarouselProps {
  anime: Anime[];
}

const SLIDE_INTERVAL_MS = 9000;

function getHeroImage(anime: Anime) {
  return anime.images?.jpg.large_image_url ?? anime.images?.jpg.image_url ?? "";
}

const HeroCarousel = ({ anime }: HeroCarouselProps) => {
  const slides = anime.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  if (!slides.length) return null;

  const normalizedActiveIndex = activeIndex % slides.length;
  const activeAnime = slides[normalizedActiveIndex] ?? slides[0];
  const activeTitle = activeAnime.title ?? "Featured anime";
  const imageUrl = getHeroImage(activeAnime);

  return (
    <div className="hero-carousel-shell">
      <section className="hero-carousel" aria-label="Top anime carousel">
        {imageUrl ? (
          <img
            className="hero-carousel-backdrop"
            src={imageUrl}
            alt=""
            aria-hidden="true"
          />
        ) : null}

        <div className="hero-carousel-content">
          <div className="hero-copy">
            <p className="hero-kicker">Top 5 Spotlight</p>
            <h1>{activeTitle}</h1>
            <div className="hero-meta">
              <span>{activeAnime.type ?? "Anime"}</span>
              <span>
                {activeAnime.score ? `Score ${activeAnime.score}` : "Unrated"}
              </span>
              <span>
                {activeAnime.episodes
                  ? `${activeAnime.episodes} episodes`
                  : "Episodes TBA"}
              </span>
            </div>
            <p className="hero-synopsis">
              {activeAnime.synopsis ??
                "A fan favorite from the current top anime list."}
            </p>

            <div className="hero-actions">
              {activeAnime.mal_id ? (
                <Link
                  className="hero-primary-action"
                  to={`/anime/${activeAnime.mal_id}`}
                >
                  View Details
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      <div className="hero-carousel-tabs" aria-label="Choose featured anime">
        <button
          className="hero-prev"
          disabled={activeIndex === 0}
          onClick={() => setActiveIndex(activeIndex - 1)}
          aria-label="Previous featured anime"
        >
          ←
        </button>
        {slides.map((item, index) => (
          <button
            className={index === normalizedActiveIndex ? "active" : ""}
            type="button"
            key={item.mal_id ?? `${item.title}-${index}`}
            aria-label={`Show ${item.title ?? `slide ${index + 1}`}`}
            aria-pressed={index === normalizedActiveIndex}
          ></button>
        ))}
        <button
          className="hero-next"
          disabled={activeIndex >= slides.length - 1}
          onClick={() => setActiveIndex(activeIndex + 1)}
          aria-label="Next featured anime"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default HeroCarousel;

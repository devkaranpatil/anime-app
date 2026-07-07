import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import type { Anime } from "../types/anime";
import type { Episode, StreamingLink } from "../types/episode";
import type { VideoData } from "../types/video";
import {
  getAnimeById,
  getAnimeEpisodes,
  getEpisodeVideo,
  getStreamingLinks,
} from "../services/animeApi";
import AnimeGrid from "../components/AnimeGrid/AnimeGrid";
import StreamingServices from "../components/StreamingServices/StreamingServices";
import { addRecentlyViewed, getRecentlyViewed } from "../util/recentlyViewed";
import "../../src/styles/AnimeDetails.css";

interface EpisodeThumbnailProps {
  imageUrl?: string;
  alt: string;
}

const EpisodeThumbnail = ({ imageUrl, alt }: EpisodeThumbnailProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "120px 0px",
  });

  return (
    <div className="ep-thumb" ref={ref}>
      {inView && imageUrl ? (
        <img src={imageUrl} alt={alt} loading="lazy" />
      ) : (
        <div className="ep-thumb-placeholder" />
      )}
    </div>
  );
};

const AnimeDetails = () => {
  const recent = getRecentlyViewed();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [video, setVideo] = useState<VideoData | null>(null);
  const [streamingLinks, setStreamingLinks] = useState<StreamingLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [epLoading, setEpLoading] = useState(false);
  const [error, setError] = useState("");
  const [epPage, setEpPage] = useState(1);
  const [hasMoreEpisodes, setHasMoreEpisodes] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "episodes">(
    "overview",
  );

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    getEpisodeVideo(Number(id))
      .then(setVideo)
      .catch(() => setVideo(null));
    getStreamingLinks(Number(id))
      .then(setStreamingLinks)
      .catch(() => setStreamingLinks([]));
    getAnimeById(Number(id))
      .then(setAnime)
      .catch(() => setError("Failed to load anime details."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!anime) return;

    addRecentlyViewed(anime);
  }, [anime]);

  useEffect(() => {
    if (!id || activeTab !== "episodes") return;
    setEpLoading(true);
    getAnimeEpisodes(Number(id), epPage)
      .then(({ episodes: eps, hasNextPage }) => {
        setEpisodes((prev) => (epPage === 1 ? eps : [...prev, ...eps]));
        setHasMoreEpisodes(hasNextPage);
      })
      .catch(() => {})
      .finally(() => setEpLoading(false));
  }, [id, activeTab, epPage]);

  const loadMoreEpisodes = () => setEpPage((p) => p + 1);

  if (loading)
    return (
      <div className="details-loading">
        <div className="details-spinner" />
        <p>Loading anime…</p>
      </div>
    );

  if (error || !anime)
    return (
      <div className="details-error">
        <p>{error || "Anime not found."}</p>
        <button onClick={() => navigate(-1)}>← Go back</button>
      </div>
    );

  const cover =
    anime.images?.jpg?.large_image_url ?? anime.images?.jpg?.image_url;

  const getEpisodePreviewImage = (ep: Episode) => {
    const matchingVideo = video?.episodes?.find(
      (item) => item.mal_id === ep.mal_id || item.episode === String(ep.mal_id),
    );

    return matchingVideo?.images?.jpg?.image_url ?? cover;
  };

  return (
    <div className="details-page">
      <div
        className="details-hero"
        style={{ backgroundImage: cover ? `url(${cover})` : undefined }}
      >
        <div className="details-hero-overlay" />
        <div className="details-hero-content">
          <div className="details-cover">
            {cover ? (
              <img src={cover} alt={anime.title} />
            ) : (
              <div className="details-cover-placeholder" />
            )}
          </div>
          <div className="details-hero-info">
            <div className="details-badges">
              {anime.type && (
                <span className="badge badge-type">{anime.type}</span>
              )}
              {anime.status && (
                <span className="badge badge-status">{anime.status}</span>
              )}
              {anime.rating && (
                <span className="badge badge-rating">{anime.rating}</span>
              )}
            </div>
            <h1 className="details-title">{anime.title}</h1>
            {anime.title_english && anime.title_english !== anime.title && (
              <p className="details-title-alt">{anime.title_english}</p>
            )}
            <div className="details-stats">
              {anime.score && (
                <div className="stat-item">
                  <span className="stat-value">
                    ⭐ {anime.score.toFixed(1)}
                  </span>
                  <span className="stat-label">
                    {anime.scored_by?.toLocaleString()} votes
                  </span>
                </div>
              )}
              {anime.rank && (
                <div className="stat-item">
                  <span className="stat-value">#{anime.rank}</span>
                  <span className="stat-label">Ranked</span>
                </div>
              )}
              {anime.popularity && (
                <div className="stat-item">
                  <span className="stat-value">#{anime.popularity}</span>
                  <span className="stat-label">Popularity</span>
                </div>
              )}
              {anime.members && (
                <div className="stat-item">
                  <span className="stat-value">
                    {(anime.members / 1000).toFixed(0)}K
                  </span>
                  <span className="stat-label">Members</span>
                </div>
              )}
            </div>
            {anime.genres && anime.genres.length > 0 && (
              <div className="details-genres">
                {anime.genres.map((g) => (
                  <span key={g.mal_id} className="genre-tag">
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="details-tabs">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "episodes" ? "active" : ""}`}
          onClick={() => setActiveTab("episodes")}
        >
          Episodes {anime.episodes ? `(${anime.episodes})` : ""}
        </button>
      </div>

      <div className="details-body">
        {activeTab === "overview" && (
          <div className="details-overview">
            <div className="details-main">
              {anime.synopsis && (
                <section className="details-section">
                  <h2>Synopsis</h2>
                  <p className="synopsis-text">{anime.synopsis}</p>
                </section>
              )}
              {anime.background && (
                <section className="details-section">
                  <h2>Background</h2>
                  <p className="synopsis-text">{anime.background}</p>
                </section>
              )}
              <StreamingServices links={streamingLinks} />
              {recent.length > 0 && (
                <>
                  <h2>Recently Viewed</h2>
                  <Link className="anime-card" to={`/anime/${anime.mal_id}`}>
                    <AnimeGrid anime={recent} />
                  </Link>
                </>
              )}
            </div>
            <aside className="details-sidebar">
              <div className="info-card">
                <h3>Information</h3>
                <dl className="info-list">
                  {anime.type && (
                    <>
                      <dt>Type</dt>
                      <dd>{anime.type}</dd>
                    </>
                  )}
                  {anime.episodes && (
                    <>
                      <dt>Episodes</dt>
                      <dd>{anime.episodes}</dd>
                    </>
                  )}
                  {anime.duration && (
                    <>
                      <dt>Duration</dt>
                      <dd>{anime.duration}</dd>
                    </>
                  )}
                  {anime.status && (
                    <>
                      <dt>Status</dt>
                      <dd>{anime.status}</dd>
                    </>
                  )}
                  {anime.aired?.string && (
                    <>
                      <dt>Aired</dt>
                      <dd>{anime.aired.string}</dd>
                    </>
                  )}
                  {anime.season && anime.year && (
                    <>
                      <dt>Season</dt>
                      <dd className="capitalize">
                        {anime.season} {anime.year}
                      </dd>
                    </>
                  )}
                  {anime.source && (
                    <>
                      <dt>Source</dt>
                      <dd>{anime.source}</dd>
                    </>
                  )}
                  {anime.studios && anime.studios.length > 0 && (
                    <>
                      <dt>Studios</dt>
                      <dd>{anime.studios.map((s) => s.name).join(", ")}</dd>
                    </>
                  )}
                </dl>
              </div>
            </aside>
          </div>
        )}

        {activeTab === "episodes" && (
          <div className="episodes-section">
            {episodes.length === 0 && !epLoading && (
              <p className="no-episodes">
                No episode data available for this anime.
              </p>
            )}
            <div className="episodes-grid">
              {episodes.map((ep) => (
                <Link
                  key={ep.mal_id}
                  to={`/anime/${id}/episode/${ep.mal_id}`}
                  className={`episode-card ${ep.filler ? "filler" : ""} ${ep.recap ? "recap" : ""}`}
                >
                  <EpisodeThumbnail
                    imageUrl={getEpisodePreviewImage(ep)}
                    alt={ep.title ?? `Episode ${ep.mal_id}`}
                  />
                  <div className="ep-number">EP {ep.mal_id}</div>
                  <div className="ep-info">
                    <p className="ep-title">
                      {ep.title ?? `Episode ${ep.mal_id}`}
                    </p>
                    {ep.aired && (
                      <p className="ep-aired">
                        {new Date(ep.aired).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    <div className="ep-tags">
                      {ep.filler && (
                        <span className="ep-tag filler-tag">Filler</span>
                      )}
                      {ep.recap && (
                        <span className="ep-tag recap-tag">Recap</span>
                      )}
                      {ep.score && (
                        <span className="ep-score">
                          ⭐ {ep.score.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {epLoading && (
              <div className="ep-loading">
                <div className="details-spinner" />
              </div>
            )}
            {hasMoreEpisodes && !epLoading && (
              <button className="load-more-btn" onClick={loadMoreEpisodes}>
                Load More Episodes
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeDetails;

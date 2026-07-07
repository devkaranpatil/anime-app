import { useState } from "react";
import type { StreamingLink } from "../../types/episode";
import { getStreamingLogoUrl } from "../../util/streamingLogos";
import "../../styles/StreamingServices.css";

interface StreamingServicesProps {
  links: StreamingLink[];
  title?: string;
}

const ITEMS_PER_PAGE = 3;

const StreamingServices = ({
  links,
  title = "Streaming Availability",
}: StreamingServicesProps) => {
  const [page, setPage] = useState(0);

  if (!links.length) return null;

  const totalPages = Math.ceil(links.length / ITEMS_PER_PAGE);

  const start = page * ITEMS_PER_PAGE;

  const visibleLinks = links.slice(start, start + ITEMS_PER_PAGE);

  return (
    <section className="streaming-services-section">
      <div className="streaming-services-header">
        <h2>{title}</h2>
      </div>

      <div className="streaming-slider">
        {totalPages > 1 && (
          <button
            className="streaming-nav-btn"
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
          >
            ←
          </button>
        )}

        <div className="streaming-services-row">
          {visibleLinks.map((link) => {
            const logo = getStreamingLogoUrl(link.name);

            return (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="streaming-service-card"
              >
                <div className="streaming-service-icon">
                  {logo ? (
                    <img src={logo} alt={link.name} />
                  ) : (
                    <span>{link.name.charAt(0)}</span>
                  )}
                </div>

                <div className="streaming-service-content">
                  <h3>{link.name}</h3>
                  <p>Watch Now</p>
                </div>
              </a>
            );
          })}
        </div>

        {totalPages > 1 && (
          <button
            className="streaming-nav-btn"
            disabled={page === totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
          >
            →
          </button>
        )}
      </div>
    </section>
  );
};

export default StreamingServices;

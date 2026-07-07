import { useState, useEffect } from "react";
import "../../styles/Pagination.css";

interface PaginationProps {
  page: number;
  lastPage: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const Pagination = ({
  page,
  lastPage,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) => {
  const [pageInput, setPageInput] = useState(page.toString());
  const [pageError, setPageError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGo = () => {
    const target = Number(pageInput);
    if (!pageInput.trim()) {
      setPageError("Please enter a page number.");
      return;
    }
    if (!Number.isInteger(target)) {
      setPageError("Page number must be an integer.");
      return;
    }
    if (Number.isNaN(target)) {
      setPageError("Please enter a valid page.");
      return;
    }

    if (target < 1 || target > lastPage) {
      setPageError(`Page must be between 1 and ${lastPage}.`);
      return;
    }
    setLoading(true);
    setPageError("");
    onPageChange(target);
  };

  useEffect(() => {
    setLoading(false);
    setPageInput(page.toString());
  }, [page]);

  const pages: (number | string)[] = [];

  pages.push(1);

  if (page > 3) pages.push("...");

  for (
    let i = Math.max(2, page - 1);
    i <= Math.min(lastPage - 1, page + 1);
    i++
  ) {
    pages.push(i);
  }

  if (page < lastPage - 2) pages.push("...");

  pages.push(lastPage);

  if (lastPage <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      <div className="pagination-go">
        <label htmlFor="goto-page">Go to page:</label>

        <input
          id="goto-page"
          type="number"
          min={1}
          max={lastPage}
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleGo();
            }
          }}
        />
        {pageError && <p className="pagination-error">{pageError}</p>}
      </div>

      <button
        className="pagination-arrow"
        disabled={page === 1}
        onClick={() => {
          (setLoading(true), onPageChange(page - 1));
        }}
        aria-label="Previous page"
      >
        &lsaquo;
      </button>
      <div className="pagination-pages">
        {loading ? (
          <span>Loading...</span>
        ) : (
          pages.map((item, index) =>
            item === "..." ? (
              <span className="pagination-dots" key={`dots-${index}`}>
                ...
              </span>
            ) : (
              <button
                key={item}
                className={page === item ? "active" : ""}
                onClick={() => {
                  (setLoading(true), onPageChange(Number(item)));
                }}
                aria-current={page === item ? "page" : undefined}
                aria-label={`Go to page ${item}`}
              >
                {item}
              </button>
            ),
          )
        )}
      </div>

      <button
        className="pagination-arrow"
        disabled={page === lastPage}
        onClick={() => {
          (setLoading(true), onPageChange(page + 1));
        }}
        aria-label="Next page"
      >
        &rsaquo;
      </button>
      <div className="pagination-limit">
        <label htmlFor="limit">Show</label>

        <select
          id="limit"
          value={limit}
          onChange={(e) => {
            (setLoading(true), onLimitChange(Number(e.target.value)));
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
        </select>

        <span>anime per page</span>
      </div>
    </nav>
  );
};

export default Pagination;

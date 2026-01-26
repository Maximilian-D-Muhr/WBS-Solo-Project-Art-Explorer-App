import { ArtworkCard } from './ArtworkCard';
import type { Artwork, ArtworkApiResponse } from '../schemas';
import './SearchResults.css';

type SearchResultsProps = {
  results: ArtworkApiResponse | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  isInGallery: (artworkId: number) => boolean;
  onAddToGallery: (artwork: Artwork) => void;
  onRemoveFromGallery: (artworkId: number) => void;
  onPageChange: (page: number) => void;
};

export function SearchResults({
  results,
  isLoading,
  error,
  searchQuery,
  isInGallery,
  onAddToGallery,
  onRemoveFromGallery,
  onPageChange,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="search-results__loading">
        <div className="search-results__spinner" />
        <p>Searching for artworks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results__error">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="search-results__empty">
        <div className="search-results__empty-icon">🔍</div>
        <h2>Discover Art</h2>
        <p>Search the Art Institute of Chicago's collection of over 300,000 artworks.</p>
      </div>
    );
  }

  if (results.data.length === 0) {
    return (
      <div className="search-results__no-results">
        <p>No artworks found for "{searchQuery}". Try a different search term.</p>
      </div>
    );
  }

  const { current_page, total_pages, total } = results.pagination;

  return (
    <div className="search-results">
      <div className="search-results__header">
        <p className="search-results__count">
          Found {total.toLocaleString()} artwork{total !== 1 ? 's' : ''} for "{searchQuery}"
        </p>
      </div>

      <div className="search-results__grid">
        {results.data.map((artwork) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            isInGallery={isInGallery(artwork.id)}
            onAddToGallery={() => onAddToGallery(artwork)}
            onRemoveFromGallery={() => onRemoveFromGallery(artwork.id)}
          />
        ))}
      </div>

      {total_pages > 1 && (
        <div className="search-results__pagination">
          <button
            type="button"
            className="search-results__page-button"
            onClick={() => onPageChange(current_page - 1)}
            disabled={current_page === 1}
          >
            Previous
          </button>
          <span className="search-results__page-info">
            Page {current_page} of {total_pages}
          </span>
          <button
            type="button"
            className="search-results__page-button"
            onClick={() => onPageChange(current_page + 1)}
            disabled={current_page === total_pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

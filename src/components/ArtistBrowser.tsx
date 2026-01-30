import { useState, useCallback } from 'react';
import { getArtistsByLetter, type ArtistInfo, type ArtistsApiResponse } from '../api';
import './ArtistBrowser.css';

type ArtistBrowserProps = {
  onSelectArtist: (artistName: string) => void;
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function ArtistBrowser({ onSelectArtist }: ArtistBrowserProps) {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [artists, setArtists] = useState<ArtistInfo[]>([]);
  const [pagination, setPagination] = useState<ArtistsApiResponse['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadArtists = useCallback(async (letter: string, page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getArtistsByLetter(letter, page);
      setArtists(result.data);
      setPagination(result.pagination);
      setSelectedLetter(letter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load artists');
      setArtists([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLetterClick = useCallback(
    (letter: string) => {
      loadArtists(letter);
    },
    [loadArtists]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (selectedLetter) {
        loadArtists(selectedLetter, page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [selectedLetter, loadArtists]
  );

  const handleArtistClick = useCallback(
    (artistName: string) => {
      onSelectArtist(artistName);
    },
    [onSelectArtist]
  );

  const formatLifespan = (birth: number | null, death: number | null): string => {
    if (!birth && !death) return '';
    if (birth && death) return `(${birth}–${death})`;
    if (birth) return `(b. ${birth})`;
    if (death) return `(d. ${death})`;
    return '';
  };

  return (
    <div className="artist-browser">
      <div className="artist-browser__header">
        <h2 className="artist-browser__title">Browse Artists</h2>
        <p className="artist-browser__subtitle">
          Select a letter to explore artists alphabetically
        </p>
      </div>

      <div className="artist-browser__alphabet">
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            type="button"
            className={`artist-browser__letter ${
              selectedLetter === letter ? 'artist-browser__letter--active' : ''
            }`}
            onClick={() => handleLetterClick(letter)}
            disabled={isLoading}
          >
            {letter}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="artist-browser__loading">
          <p>Loading artists...</p>
        </div>
      )}

      {error && (
        <div className="artist-browser__error">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && artists.length > 0 && (
        <>
          <div className="artist-browser__results">
            <p className="artist-browser__count">
              {pagination?.total.toLocaleString()} artists found starting with "{selectedLetter}"
            </p>
            <ul className="artist-browser__list">
              {artists.map((artist) => (
                <li key={artist.id} className="artist-browser__item">
                  <button
                    type="button"
                    className="artist-browser__artist-button"
                    onClick={() => handleArtistClick(artist.title)}
                  >
                    <span className="artist-browser__artist-name">{artist.title}</span>
                    <span className="artist-browser__artist-dates">
                      {formatLifespan(artist.birth_date, artist.death_date)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {pagination && pagination.total_pages > 1 && (
            <div className="artist-browser__pagination">
              <button
                type="button"
                className="artist-browser__page-button"
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1 || isLoading}
              >
                Previous
              </button>
              <span className="artist-browser__page-info">
                Page {pagination.current_page} of {pagination.total_pages}
              </span>
              <button
                type="button"
                className="artist-browser__page-button"
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.total_pages || isLoading}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {!isLoading && !error && selectedLetter && artists.length === 0 && (
        <div className="artist-browser__empty">
          <p>No artists found starting with "{selectedLetter}"</p>
        </div>
      )}

      {!selectedLetter && !isLoading && (
        <div className="artist-browser__welcome">
          <p>Click a letter above to browse artists</p>
        </div>
      )}
    </div>
  );
}

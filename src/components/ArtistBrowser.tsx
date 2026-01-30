import { useState, useCallback } from 'react';
import { ARTISTS_BY_LETTER, ALL_LETTERS, type ArtistEntry } from '../data/artists';
import './ArtistBrowser.css';

type ArtistBrowserProps = {
  onSelectArtist: (artistName: string) => void;
};

export function ArtistBrowser({ onSelectArtist }: ArtistBrowserProps) {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const handleLetterClick = useCallback((letter: string) => {
    setSelectedLetter(letter === selectedLetter ? null : letter);
  }, [selectedLetter]);

  const handleArtistClick = useCallback(
    (artistName: string) => {
      onSelectArtist(artistName);
    },
    [onSelectArtist]
  );

  const artists: ArtistEntry[] = selectedLetter ? ARTISTS_BY_LETTER[selectedLetter] || [] : [];

  return (
    <div className="artist-browser">
      <div className="artist-browser__header">
        <h2 className="artist-browser__title">Browse Artists</h2>
        <p className="artist-browser__subtitle">
          Select a letter to explore artists alphabetically, then click on an artist to search their works
        </p>
      </div>

      <div className="artist-browser__alphabet">
        {ALL_LETTERS.map((letter) => (
          <button
            key={letter}
            type="button"
            className={`artist-browser__letter ${
              selectedLetter === letter ? 'artist-browser__letter--active' : ''
            }`}
            onClick={() => handleLetterClick(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {selectedLetter && artists.length > 0 && (
        <div className="artist-browser__results">
          <p className="artist-browser__count">
            {artists.length} artists starting with "{selectedLetter}"
          </p>
          <ul className="artist-browser__list">
            {artists.map((artist) => (
              <li key={artist.name} className="artist-browser__item">
                <button
                  type="button"
                  className="artist-browser__artist-button"
                  onClick={() => handleArtistClick(artist.name)}
                >
                  <span className="artist-browser__artist-name">{artist.name}</span>
                  {artist.lifespan && (
                    <span className="artist-browser__artist-dates">
                      ({artist.lifespan})
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedLetter && artists.length === 0 && (
        <div className="artist-browser__empty">
          <p>No artists found starting with "{selectedLetter}"</p>
        </div>
      )}

      {!selectedLetter && (
        <div className="artist-browser__welcome">
          <p>Click a letter above to browse artists</p>
        </div>
      )}
    </div>
  );
}

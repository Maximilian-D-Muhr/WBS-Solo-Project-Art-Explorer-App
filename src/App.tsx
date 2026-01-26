import { useState, useCallback } from 'react';
import { SearchBar, SearchResults, Gallery } from './components';
import { useGallery } from './hooks';
import { searchArtworks } from './api';
import type { ArtworkApiResponse, Artwork } from './schemas';
import './App.css';

type View = 'search' | 'gallery';

function App() {
  const [currentView, setCurrentView] = useState<View>('search');
  const [searchResults, setSearchResults] = useState<ArtworkApiResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    gallery,
    addToGallery,
    removeFromGallery,
    isInGallery,
    updateNote,
    deleteNote,
  } = useGallery();

  const handleSearch = useCallback(async (query: string, page: number = 1): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSearchQuery(query);

    try {
      const results = await searchArtworks(query, page);
      setSearchResults(results);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePageChange = useCallback(
    (page: number): void => {
      if (searchQuery) {
        handleSearch(searchQuery, page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [searchQuery, handleSearch]
  );

  const handleAddToGallery = useCallback(
    (artwork: Artwork): void => {
      addToGallery(artwork);
    },
    [addToGallery]
  );

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-content">
          <h1 className="app__logo">Art Explorer</h1>
          <nav className="app__nav">
            <button
              type="button"
              className={`app__nav-button ${currentView === 'search' ? 'app__nav-button--active' : ''}`}
              onClick={() => setCurrentView('search')}
            >
              Search
            </button>
            <button
              type="button"
              className={`app__nav-button ${currentView === 'gallery' ? 'app__nav-button--active' : ''}`}
              onClick={() => setCurrentView('gallery')}
            >
              My Gallery
              {gallery.length > 0 && (
                <span className="app__nav-badge">{gallery.length}</span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="app__main">
        {currentView === 'search' ? (
          <div className="app__search-view">
            <div className="app__search-header">
              <h2 className="app__section-title">Explore the Collection</h2>
              <p className="app__section-subtitle">
                Search over 300,000 artworks from the Art Institute of Chicago
              </p>
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>
            <SearchResults
              results={searchResults}
              isLoading={isLoading}
              error={error}
              searchQuery={searchQuery}
              isInGallery={isInGallery}
              onAddToGallery={handleAddToGallery}
              onRemoveFromGallery={removeFromGallery}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <Gallery
            gallery={gallery}
            onRemoveFromGallery={removeFromGallery}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
          />
        )}
      </main>

      <footer className="app__footer">
        <p>
          Data provided by the{' '}
          <a
            href="https://www.artic.edu/open-access/public-api"
            target="_blank"
            rel="noopener noreferrer"
          >
            Art Institute of Chicago API
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;

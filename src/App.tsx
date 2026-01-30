import { useState, useCallback } from 'react';
import {
  SearchBar,
  SearchResults,
  Gallery,
  AdvancedSearch,
  ArtistBrowser,
} from './components';
import { useGallery } from './hooks';
import { searchArtworks, advancedSearchArtworks, type AdvancedSearchParams } from './api';
import type { ArtworkApiResponse, Artwork } from './schemas';
import './App.css';

type View = 'search' | 'gallery' | 'advanced' | 'artists';

function App() {
  const [currentView, setCurrentView] = useState<View>('search');
  const [searchResults, setSearchResults] = useState<ArtworkApiResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [advancedParams, setAdvancedParams] = useState<AdvancedSearchParams | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string>('');
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

  const handleAdvancedSearch = useCallback(async (params: AdvancedSearchParams, page: number = 1): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setAdvancedParams(params);

    try {
      const results = await advancedSearchArtworks({ ...params, page });
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
      if (currentView === 'advanced' && advancedParams) {
        handleAdvancedSearch(advancedParams, page);
      } else if (searchQuery) {
        handleSearch(searchQuery, page);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentView, searchQuery, advancedParams, handleSearch, handleAdvancedSearch]
  );

  const handleAddToGallery = useCallback(
    (artwork: Artwork): void => {
      addToGallery(artwork);
    },
    [addToGallery]
  );

  const handleSelectArtist = useCallback((artistName: string): void => {
    setSelectedArtist(artistName);
    setSearchResults(null);
    setError(null);
    setCurrentView('advanced');
  }, []);

  const handleViewChange = useCallback((view: View): void => {
    if (view !== 'advanced') {
      setSelectedArtist('');
    }
    setCurrentView(view);
  }, []);

  const getSearchDescription = (): string => {
    if (currentView === 'advanced' && advancedParams) {
      const parts: string[] = [];
      if (advancedParams.title) parts.push(`title: "${advancedParams.title}"`);
      if (advancedParams.artist) parts.push(`artist: "${advancedParams.artist}"`);
      if (advancedParams.dateStart !== undefined || advancedParams.dateEnd !== undefined) {
        const start = advancedParams.dateStart ?? 'any';
        const end = advancedParams.dateEnd ?? 'any';
        parts.push(`years: ${start}–${end}`);
      }
      return parts.join(', ');
    }
    return searchQuery;
  };

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-content">
          <h1 className="app__logo">Art Explorer</h1>
          <nav className="app__nav">
            <button
              type="button"
              className={`app__nav-button ${currentView === 'search' ? 'app__nav-button--active' : ''}`}
              onClick={() => handleViewChange('search')}
            >
              Search
            </button>
            <button
              type="button"
              className={`app__nav-button ${currentView === 'advanced' ? 'app__nav-button--active' : ''}`}
              onClick={() => handleViewChange('advanced')}
            >
              Advanced
            </button>
            <button
              type="button"
              className={`app__nav-button ${currentView === 'artists' ? 'app__nav-button--active' : ''}`}
              onClick={() => handleViewChange('artists')}
            >
              Artists
            </button>
            <button
              type="button"
              className={`app__nav-button ${currentView === 'gallery' ? 'app__nav-button--active' : ''}`}
              onClick={() => handleViewChange('gallery')}
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
        {currentView === 'search' && (
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
        )}

        {currentView === 'advanced' && (
          <div className="app__advanced-view">
            <AdvancedSearch
              onSearch={handleAdvancedSearch}
              isLoading={isLoading}
              initialArtist={selectedArtist}
            />
            <SearchResults
              results={searchResults}
              isLoading={isLoading}
              error={error}
              searchQuery={getSearchDescription()}
              isInGallery={isInGallery}
              onAddToGallery={handleAddToGallery}
              onRemoveFromGallery={removeFromGallery}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {currentView === 'artists' && (
          <div className="app__artists-view">
            <ArtistBrowser onSelectArtist={handleSelectArtist} />
          </div>
        )}

        {currentView === 'gallery' && (
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
          {' · '}
          <a
            href={`${import.meta.env.BASE_URL}Art-Explorer-Presentation.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            About this Project
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;

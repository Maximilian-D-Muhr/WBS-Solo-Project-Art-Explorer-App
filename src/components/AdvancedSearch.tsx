import { useState, useCallback, useEffect, type FormEvent } from 'react';
import type { AdvancedSearchParams } from '../api';
import './AdvancedSearch.css';

type AdvancedSearchProps = {
  onSearch: (params: AdvancedSearchParams, page?: number) => Promise<void>;
  isLoading: boolean;
  initialArtist?: string;
};

const MIN_YEAR = -3000;
const MAX_YEAR = 2025;

export function AdvancedSearch({ onSearch, isLoading, initialArtist = '' }: AdvancedSearchProps) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState(initialArtist);
  const [yearRange, setYearRange] = useState<[number, number]>([MIN_YEAR, MAX_YEAR]);
  const [isYearFilterActive, setIsYearFilterActive] = useState(false);

  // Update artist when initialArtist prop changes
  useEffect(() => {
    if (initialArtist) {
      setArtist(initialArtist);
    }
  }, [initialArtist]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const params: AdvancedSearchParams = {};

      if (title.trim()) params.title = title.trim();
      if (artist.trim()) params.artist = artist.trim();
      if (isYearFilterActive) {
        params.dateStart = yearRange[0];
        params.dateEnd = yearRange[1];
      }

      await onSearch(params);
    },
    [title, artist, yearRange, isYearFilterActive, onSearch]
  );

  const handleClear = useCallback(() => {
    setTitle('');
    setArtist('');
    setYearRange([MIN_YEAR, MAX_YEAR]);
    setIsYearFilterActive(false);
  }, []);

  const handleYearMinChange = useCallback((value: number) => {
    setYearRange(([_, max]) => [Math.min(value, max), max]);
    setIsYearFilterActive(true);
  }, []);

  const handleYearMaxChange = useCallback((value: number) => {
    setYearRange(([min, _]) => [min, Math.max(value, min)]);
    setIsYearFilterActive(true);
  }, []);

  const hasFilters = title || artist || isYearFilterActive;

  const formatYear = (year: number): string => {
    if (year < 0) return `${Math.abs(year)} BCE`;
    return `${year} CE`;
  };

  return (
    <form className="advanced-search" onSubmit={handleSubmit}>
      <div className="advanced-search__grid">
        <div className="advanced-search__field">
          <label htmlFor="title" className="advanced-search__label">
            Artwork Title
          </label>
          <input
            type="text"
            id="title"
            className="advanced-search__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Water Lilies, Starry Night"
            disabled={isLoading}
          />
        </div>

        <div className="advanced-search__field">
          <label htmlFor="artist" className="advanced-search__label">
            Artist Name
          </label>
          <input
            type="text"
            id="artist"
            className="advanced-search__input"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="e.g. Monet, Van Gogh, Picasso"
            disabled={isLoading}
          />
        </div>

        <div className="advanced-search__field advanced-search__field--full">
          <div className="advanced-search__year-header">
            <label className="advanced-search__label">
              Year Range
            </label>
            <label className="advanced-search__checkbox-label">
              <input
                type="checkbox"
                checked={isYearFilterActive}
                onChange={(e) => setIsYearFilterActive(e.target.checked)}
                disabled={isLoading}
              />
              <span>Filter by year</span>
            </label>
          </div>

          <div className={`advanced-search__year-slider ${!isYearFilterActive ? 'advanced-search__year-slider--disabled' : ''}`}>
            <div className="advanced-search__year-display">
              <span className="advanced-search__year-value">{formatYear(yearRange[0])}</span>
              <span className="advanced-search__year-separator">to</span>
              <span className="advanced-search__year-value">{formatYear(yearRange[1])}</span>
            </div>

            <div className="advanced-search__sliders">
              <div className="advanced-search__slider-group">
                <label htmlFor="yearMin" className="advanced-search__slider-label">From</label>
                <input
                  type="range"
                  id="yearMin"
                  className="advanced-search__range"
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  value={yearRange[0]}
                  onChange={(e) => handleYearMinChange(parseInt(e.target.value, 10))}
                  disabled={isLoading || !isYearFilterActive}
                />
              </div>
              <div className="advanced-search__slider-group">
                <label htmlFor="yearMax" className="advanced-search__slider-label">To</label>
                <input
                  type="range"
                  id="yearMax"
                  className="advanced-search__range"
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  value={yearRange[1]}
                  onChange={(e) => handleYearMaxChange(parseInt(e.target.value, 10))}
                  disabled={isLoading || !isYearFilterActive}
                />
              </div>
            </div>

            <div className="advanced-search__year-presets">
              <button
                type="button"
                className="advanced-search__preset"
                onClick={() => { setYearRange([-3000, 0]); setIsYearFilterActive(true); }}
                disabled={isLoading}
              >
                Ancient
              </button>
              <button
                type="button"
                className="advanced-search__preset"
                onClick={() => { setYearRange([1400, 1600]); setIsYearFilterActive(true); }}
                disabled={isLoading}
              >
                Renaissance
              </button>
              <button
                type="button"
                className="advanced-search__preset"
                onClick={() => { setYearRange([1800, 1900]); setIsYearFilterActive(true); }}
                disabled={isLoading}
              >
                19th Century
              </button>
              <button
                type="button"
                className="advanced-search__preset"
                onClick={() => { setYearRange([1900, 2000]); setIsYearFilterActive(true); }}
                disabled={isLoading}
              >
                20th Century
              </button>
              <button
                type="button"
                className="advanced-search__preset"
                onClick={() => { setYearRange([2000, 2025]); setIsYearFilterActive(true); }}
                disabled={isLoading}
              >
                Contemporary
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="advanced-search__actions">
        <button
          type="submit"
          className="advanced-search__button advanced-search__button--primary"
          disabled={isLoading || !hasFilters}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
        <button
          type="button"
          className="advanced-search__button advanced-search__button--secondary"
          onClick={handleClear}
          disabled={isLoading || !hasFilters}
        >
          Clear Filters
        </button>
      </div>

      <div className="advanced-search__hints">
        <p className="advanced-search__hint">
          <strong>Tip:</strong> Combine filters for more precise results.
          For example, search for "landscape" by "Monet" between 1870-1890.
        </p>
      </div>
    </form>
  );
}

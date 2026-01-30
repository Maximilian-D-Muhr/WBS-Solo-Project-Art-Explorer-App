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

  const setPreset = useCallback((start: number, end: number) => {
    setYearRange([start, end]);
    setIsYearFilterActive(true);
  }, []);

  const hasFilters = title || artist || isYearFilterActive;

  const formatYear = (year: number): string => {
    if (year < 0) return `${Math.abs(year)} BCE`;
    return `${year}`;
  };

  return (
    <form className="advanced-search" onSubmit={handleSubmit}>
      <div className="advanced-search__grid">
        {/* Title Field */}
        <div className="advanced-search__field">
          <label htmlFor="title" className="advanced-search__label">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="advanced-search__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Water Lilies, Starry Night..."
            disabled={isLoading}
          />
        </div>

        {/* Artist Field */}
        <div className="advanced-search__field">
          <label htmlFor="artist" className="advanced-search__label">
            Artist
          </label>
          <input
            type="text"
            id="artist"
            className="advanced-search__input"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Monet, Van Gogh..."
            disabled={isLoading}
          />
        </div>

        {/* Year Range - Compact */}
        <div className="advanced-search__field advanced-search__field--year">
          <div className="advanced-search__year-section">
            <label className="advanced-search__year-toggle">
              <input
                type="checkbox"
                checked={isYearFilterActive}
                onChange={(e) => setIsYearFilterActive(e.target.checked)}
                disabled={isLoading}
              />
              <span>Year</span>
            </label>

            <div className={`advanced-search__year-controls ${!isYearFilterActive ? 'advanced-search__year-controls--disabled' : ''}`}>
              <div className="advanced-search__year-display">
                <span className="advanced-search__year-value">{formatYear(yearRange[0])}</span>
                <span>–</span>
                <span className="advanced-search__year-value">{formatYear(yearRange[1])}</span>
              </div>

              <div className="advanced-search__sliders">
                <input
                  type="range"
                  className="advanced-search__range"
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  value={yearRange[0]}
                  onChange={(e) => handleYearMinChange(parseInt(e.target.value, 10))}
                  disabled={isLoading || !isYearFilterActive}
                />
                <input
                  type="range"
                  className="advanced-search__range"
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  value={yearRange[1]}
                  onChange={(e) => handleYearMaxChange(parseInt(e.target.value, 10))}
                  disabled={isLoading || !isYearFilterActive}
                />
              </div>

              <div className="advanced-search__presets">
                <button type="button" className="advanced-search__preset" onClick={() => setPreset(-3000, 0)} disabled={isLoading}>Ancient</button>
                <button type="button" className="advanced-search__preset" onClick={() => setPreset(1400, 1600)} disabled={isLoading}>Renaiss.</button>
                <button type="button" className="advanced-search__preset" onClick={() => setPreset(1800, 1900)} disabled={isLoading}>19th C.</button>
                <button type="button" className="advanced-search__preset" onClick={() => setPreset(1900, 2000)} disabled={isLoading}>20th C.</button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="advanced-search__actions">
          <button
            type="submit"
            className="advanced-search__button advanced-search__button--primary"
            disabled={isLoading || !hasFilters}
          >
            {isLoading ? '...' : 'Search'}
          </button>
          <button
            type="button"
            className="advanced-search__button advanced-search__button--secondary"
            onClick={handleClear}
            disabled={isLoading || !hasFilters}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
}

import { useState, type FormEvent } from 'react';
import './SearchBar.css';

type SearchBarProps = {
  onSearch: (query: string) => void;
  isLoading: boolean;
};

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Search artworks (e.g., Monet, starry night, impressionism...)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isLoading}
      />
      <button
        type="submit"
        className="search-bar__button"
        disabled={!query.trim() || isLoading}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}

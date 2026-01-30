import { useCallback } from 'react';
import './ArtistBrowser.css';

type ArtistBrowserProps = {
  onSelectArtist: (artistName: string) => void;
};

// Alphabetically sorted list of notable artists
const ARTISTS = [
  'Ansel Adams',
  'Josef Albers',
  'Albrecht Altdorfer',
  'Fra Angelico',
  'Alexander Archipenko',
  'Jean Arp',
  'John James Audubon',
  'Francis Bacon',
  'Balthus',
  'Jean-Michel Basquiat',
  'Max Beckmann',
  'Giovanni Bellini',
  'Thomas Hart Benton',
  'Gian Lorenzo Bernini',
  'Albert Bierstadt',
  'William Blake',
  'Umberto Boccioni',
  'Pierre Bonnard',
  'Hieronymus Bosch',
  'Sandro Botticelli',
  'François Boucher',
  'Louise Bourgeois',
  'Constantin Brancusi',
  'Georges Braque',
  'Pieter Bruegel the Elder',
  'Gustave Caillebotte',
  'Alexander Calder',
  'Canaletto',
  'Caravaggio',
  'Mary Cassatt',
  'Paul Cézanne',
  'Marc Chagall',
  'Jean-Baptiste-Siméon Chardin',
  'Frederic Edwin Church',
  'Chuck Close',
  'Thomas Cole',
  'John Constable',
  'Joseph Cornell',
  'Jean-Baptiste-Camille Corot',
  'Gustave Courbet',
  'Lucas Cranach the Elder',
  'Salvador Dalí',
  'Honoré Daumier',
  'Jacques-Louis David',
  'Stuart Davis',
  'Edgar Degas',
  'Willem de Kooning',
  'Eugène Delacroix',
  'Robert Delaunay',
  'Richard Diebenkorn',
  'Otto Dix',
  'Jean Dubuffet',
  'Marcel Duchamp',
  'Raoul Dufy',
  'Albrecht Dürer',
  'Thomas Eakins',
  'El Greco',
  'James Ensor',
  'Max Ernst',
  'Jan van Eyck',
  'Henri Fantin-Latour',
  'Lyonel Feininger',
  'Dan Flavin',
  'Jean-Honoré Fragonard',
  'Helen Frankenthaler',
  'Lucian Freud',
  'Caspar David Friedrich',
  'Thomas Gainsborough',
  'Paul Gauguin',
  'Artemisia Gentileschi',
  'Alberto Giacometti',
  'Giotto di Bondone',
  'Francisco Goya',
  'Juan Gris',
  'George Grosz',
  'Frans Hals',
  'Marsden Hartley',
  'Childe Hassam',
  'Barbara Hepworth',
  'Eva Hesse',
  'David Hockney',
  'Hans Hofmann',
  'Katsushika Hokusai',
  'Hans Holbein the Younger',
  'Winslow Homer',
  'Edward Hopper',
  'Jean-Auguste-Dominique Ingres',
  'Jasper Johns',
  'Donald Judd',
  'Frida Kahlo',
  'Vasily Kandinsky',
  'Ellsworth Kelly',
  'Anselm Kiefer',
  'Ernst Ludwig Kirchner',
  'Paul Klee',
  'Gustav Klimt',
  'Franz Kline',
  'Käthe Kollwitz',
  'Jeff Koons',
  'Yayoi Kusama',
  'Fernand Léger',
  'Leonardo da Vinci',
  'Roy Lichtenstein',
  'René Magritte',
  'Édouard Manet',
  'Andrea Mantegna',
  'Franz Marc',
  'Agnes Martin',
  'Henri Matisse',
  'Michelangelo',
  'Joan Miró',
  'Amedeo Modigliani',
  'Piet Mondrian',
  'Claude Monet',
  'Henry Moore',
  'Berthe Morisot',
  'Robert Motherwell',
  'Alphonse Mucha',
  'Edvard Munch',
  'Barnett Newman',
  'Emil Nolde',
  "Georgia O'Keeffe",
  'Claes Oldenburg',
  'Nam June Paik',
  'Pablo Picasso',
  'Camille Pissarro',
  'Jackson Pollock',
  'Nicolas Poussin',
  'Raphael',
  'Robert Rauschenberg',
  'Odilon Redon',
  'Rembrandt van Rijn',
  'Pierre-Auguste Renoir',
  'Gerhard Richter',
  'Diego Rivera',
  'Norman Rockwell',
  'Auguste Rodin',
  'Mark Rothko',
  'Henri Rousseau',
  'Peter Paul Rubens',
  'Ed Ruscha',
  'John Singer Sargent',
  'Egon Schiele',
  'Georges Seurat',
  'Cindy Sherman',
  'Alfred Sisley',
  'Frank Stella',
  'Clyfford Still',
  'Yves Tanguy',
  'Giovanni Battista Tiepolo',
  'Tintoretto',
  'Titian',
  'Henri de Toulouse-Lautrec',
  'J.M.W. Turner',
  'Cy Twombly',
  'Diego Velázquez',
  'Jan Vermeer',
  'Paolo Veronese',
  'Élisabeth Vigée Le Brun',
  'Édouard Vuillard',
  'Andy Warhol',
  'Antoine Watteau',
  'James McNeill Whistler',
  'Grant Wood',
  'Andrew Wyeth',
  'Francisco de Zurbarán',
];

export function ArtistBrowser({ onSelectArtist }: ArtistBrowserProps) {
  const handleArtistClick = useCallback(
    (artistName: string) => {
      onSelectArtist(artistName);
    },
    [onSelectArtist]
  );

  return (
    <div className="artist-browser">
      <div className="artist-browser__header">
        <h2 className="artist-browser__title">Browse Artists</h2>
        <p className="artist-browser__subtitle">
          Click on an artist to search their works
        </p>
      </div>

      <ul className="artist-browser__list">
        {ARTISTS.map((artist) => (
          <li key={artist} className="artist-browser__item">
            <button
              type="button"
              className="artist-browser__artist-button"
              onClick={() => handleArtistClick(artist)}
            >
              {artist}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

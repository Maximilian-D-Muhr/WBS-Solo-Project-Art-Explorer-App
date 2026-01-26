import { ArtworkCard } from './ArtworkCard';
import type { Gallery as GalleryType } from '../schemas';
import './Gallery.css';

type GalleryProps = {
  gallery: GalleryType;
  onRemoveFromGallery: (artworkId: number) => void;
  onUpdateNote: (artworkId: number, text: string) => void;
  onDeleteNote: (artworkId: number) => void;
};

export function Gallery({
  gallery,
  onRemoveFromGallery,
  onUpdateNote,
  onDeleteNote,
}: GalleryProps) {
  if (gallery.length === 0) {
    return (
      <div className="gallery__empty">
        <div className="gallery__empty-icon">🖼️</div>
        <h2>Your Gallery is Empty</h2>
        <p>Search for artworks and add them to your personal collection.</p>
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="gallery__header">
        <h2>My Gallery</h2>
        <span className="gallery__count">{gallery.length} artwork{gallery.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="gallery__grid">
        {gallery.map((item) => (
          <ArtworkCard
            key={item.artwork.id}
            artwork={item.artwork}
            isInGallery={true}
            note={item.note}
            onRemoveFromGallery={() => onRemoveFromGallery(item.artwork.id)}
            onUpdateNote={(text) => onUpdateNote(item.artwork.id, text)}
            onDeleteNote={() => onDeleteNote(item.artwork.id)}
            showNoteEditor={true}
          />
        ))}
      </div>
    </div>
  );
}

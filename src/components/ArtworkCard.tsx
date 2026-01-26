import { useState } from 'react';
import { getImageUrl } from '../api';
import type { Artwork, Note } from '../schemas';
import './ArtworkCard.css';

type ArtworkCardProps = {
  artwork: Artwork;
  isInGallery: boolean;
  note?: Note | null;
  onAddToGallery?: () => void;
  onRemoveFromGallery?: () => void;
  onUpdateNote?: (text: string) => void;
  onDeleteNote?: () => void;
  showNoteEditor?: boolean;
};

export function ArtworkCard({
  artwork,
  isInGallery,
  note,
  onAddToGallery,
  onRemoveFromGallery,
  onUpdateNote,
  onDeleteNote,
  showNoteEditor = false,
}: ArtworkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(note?.text ?? '');
  const [imageError, setImageError] = useState(false);

  const imageUrl = getImageUrl(artwork.image_id, 400);
  const artistName = artwork.artist_title ?? artwork.artist_display ?? 'Unknown Artist';

  const handleSaveNote = (): void => {
    if (onUpdateNote && noteText.trim()) {
      onUpdateNote(noteText.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (): void => {
    setNoteText(note?.text ?? '');
    setIsEditing(false);
  };

  const handleDeleteNote = (): void => {
    if (onDeleteNote) {
      onDeleteNote();
      setNoteText('');
    }
  };

  return (
    <article className="artwork-card">
      <div className="artwork-card__image-container">
        {imageError || !artwork.image_id ? (
          <div className="artwork-card__placeholder">
            <span>No Image Available</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={artwork.thumbnail?.alt_text ?? artwork.title}
            className="artwork-card__image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <div className="artwork-card__content">
        <h3 className="artwork-card__title">{artwork.title}</h3>
        <p className="artwork-card__artist">{artistName}</p>
        {artwork.date_display && (
          <p className="artwork-card__date">{artwork.date_display}</p>
        )}
      </div>

      <div className="artwork-card__actions">
        {isInGallery ? (
          <button
            type="button"
            className="artwork-card__button artwork-card__button--remove"
            onClick={onRemoveFromGallery}
          >
            Remove from Gallery
          </button>
        ) : (
          <button
            type="button"
            className="artwork-card__button artwork-card__button--add"
            onClick={onAddToGallery}
          >
            Add to Gallery
          </button>
        )}
      </div>

      {showNoteEditor && isInGallery && (
        <div className="artwork-card__notes">
          {isEditing ? (
            <div className="artwork-card__note-editor">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note about this artwork..."
                maxLength={500}
                className="artwork-card__note-textarea"
              />
              <div className="artwork-card__note-actions">
                <span className="artwork-card__note-count">
                  {noteText.length}/500
                </span>
                <button
                  type="button"
                  className="artwork-card__button artwork-card__button--secondary"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="artwork-card__button artwork-card__button--primary"
                  onClick={handleSaveNote}
                  disabled={!noteText.trim()}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="artwork-card__note-display">
              {note?.text ? (
                <>
                  <p className="artwork-card__note-text">{note.text}</p>
                  <div className="artwork-card__note-actions">
                    <button
                      type="button"
                      className="artwork-card__button artwork-card__button--secondary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Note
                    </button>
                    <button
                      type="button"
                      className="artwork-card__button artwork-card__button--danger"
                      onClick={handleDeleteNote}
                    >
                      Delete Note
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  className="artwork-card__button artwork-card__button--secondary"
                  onClick={() => setIsEditing(true)}
                >
                  Add Note
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

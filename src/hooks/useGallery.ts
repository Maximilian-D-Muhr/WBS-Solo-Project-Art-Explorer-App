import { useState, useEffect, useCallback } from 'react';
import {
  GallerySchema,
  NoteSchema,
  type Gallery,
  type GalleryItem,
  type Artwork,
  type Note,
} from '../schemas';

const STORAGE_KEY = 'art-explorer-gallery';

function loadGalleryFromStorage(): Gallery {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }

  const parsed: unknown = JSON.parse(stored);
  const { data, success } = GallerySchema.safeParse(parsed);

  if (!success) {
    console.warn('Invalid gallery data in localStorage, resetting...');
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }

  return data;
}

function saveGalleryToStorage(gallery: Gallery): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gallery));
}

type UseGalleryReturn = {
  gallery: Gallery;
  addToGallery: (artwork: Artwork) => boolean;
  removeFromGallery: (artworkId: number) => void;
  isInGallery: (artworkId: number) => boolean;
  updateNote: (artworkId: number, text: string) => boolean;
  deleteNote: (artworkId: number) => void;
  getNote: (artworkId: number) => Note | null;
};

export function useGallery(): UseGalleryReturn {
  const [gallery, setGallery] = useState<Gallery>(() => loadGalleryFromStorage());

  useEffect(() => {
    saveGalleryToStorage(gallery);
  }, [gallery]);

  const isInGallery = useCallback(
    (artworkId: number): boolean => {
      return gallery.some((item) => item.artwork.id === artworkId);
    },
    [gallery]
  );

  const addToGallery = useCallback(
    (artwork: Artwork): boolean => {
      if (isInGallery(artwork.id)) {
        return false;
      }

      const newItem: GalleryItem = {
        artwork,
        note: null,
        addedAt: new Date().toISOString(),
      };

      setGallery((prev) => [...prev, newItem]);
      return true;
    },
    [isInGallery]
  );

  const removeFromGallery = useCallback((artworkId: number): void => {
    setGallery((prev) => prev.filter((item) => item.artwork.id !== artworkId));
  }, []);

  const updateNote = useCallback((artworkId: number, text: string): boolean => {
    const noteData = {
      artworkId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { success } = NoteSchema.safeParse(noteData);
    if (!success) {
      return false;
    }

    setGallery((prev) =>
      prev.map((item) => {
        if (item.artwork.id !== artworkId) {
          return item;
        }

        const existingNote = item.note;
        const note: Note = {
          artworkId,
          text: text.trim(),
          createdAt: existingNote?.createdAt ?? new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return { ...item, note };
      })
    );

    return true;
  }, []);

  const deleteNote = useCallback((artworkId: number): void => {
    setGallery((prev) =>
      prev.map((item) => {
        if (item.artwork.id !== artworkId) {
          return item;
        }
        return { ...item, note: null };
      })
    );
  }, []);

  const getNote = useCallback(
    (artworkId: number): Note | null => {
      const item = gallery.find((item) => item.artwork.id === artworkId);
      return item?.note ?? null;
    },
    [gallery]
  );

  return {
    gallery,
    addToGallery,
    removeFromGallery,
    isInGallery,
    updateNote,
    deleteNote,
    getNote,
  };
}

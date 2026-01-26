import { z } from 'zod';

export const ArtworkSchema = z.object({
  id: z.number().int(),
  title: z.string().default('Untitled'),
  artist_title: z.string().nullable().default(null),
  artist_display: z.string().nullable().default(null),
  date_display: z.string().nullable().default(null),
  medium_display: z.string().nullable().default(null),
  dimensions: z.string().nullable().default(null),
  image_id: z.string().nullable().default(null),
  thumbnail: z
    .object({
      alt_text: z.string().nullable().default(null),
      width: z.number().nullable().default(null),
      height: z.number().nullable().default(null),
    })
    .nullable()
    .default(null),
});

export type Artwork = z.infer<typeof ArtworkSchema>;

export const ArtworkArraySchema = z.array(ArtworkSchema);

export type ArtworkList = z.infer<typeof ArtworkArraySchema>;

export const ArtworkApiResponseSchema = z.object({
  data: ArtworkArraySchema,
  pagination: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    total_pages: z.number(),
    current_page: z.number(),
  }),
  config: z.object({
    iiif_url: z.string(),
  }),
});

export type ArtworkApiResponse = z.infer<typeof ArtworkApiResponseSchema>;

export const NoteSchema = z.object({
  artworkId: z.number().int(),
  text: z.string().max(500, 'Note must be 500 characters or less'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Note = z.infer<typeof NoteSchema>;

export const GalleryItemSchema = z.object({
  artwork: ArtworkSchema,
  note: NoteSchema.nullable().default(null),
  addedAt: z.string(),
});

export type GalleryItem = z.infer<typeof GalleryItemSchema>;

export const GallerySchema = z.array(GalleryItemSchema);

export type Gallery = z.infer<typeof GallerySchema>;

import { z } from 'zod';
import {
  ArtworkApiResponseSchema,
  type Artwork,
  type ArtworkApiResponse,
} from '../schemas';

const AIC_API_BASE = 'https://api.artic.edu/api/v1';

export function getImageUrl(imageId: string | null, size: number = 843): string {
  if (!imageId) {
    return '/placeholder-art.svg';
  }
  return `https://www.artic.edu/iiif/2/${imageId}/full/${size},/0/default.jpg`;
}

export async function searchArtworks(
  query: string,
  page: number = 1,
  limit: number = 12
): Promise<ArtworkApiResponse> {
  if (!query.trim()) {
    throw new Error('Search query cannot be empty');
  }

  const params = new URLSearchParams({
    q: query.trim(),
    page: String(page),
    limit: String(limit),
    fields: [
      'id',
      'title',
      'artist_title',
      'artist_display',
      'date_display',
      'medium_display',
      'dimensions',
      'image_id',
      'thumbnail',
    ].join(','),
  });

  const response = await fetch(`${AIC_API_BASE}/artworks/search?${params}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const resData: unknown = await response.json();
  const { data, error, success } = ArtworkApiResponseSchema.safeParse(resData);

  if (!success) {
    console.error('Validation error:', z.prettifyError(error));
    throw new Error('Invalid data received from API');
  }

  return data;
}

export type AdvancedSearchParams = {
  title?: string;
  artist?: string;
  dateStart?: number;
  dateEnd?: number;
  page?: number;
  limit?: number;
};

export async function advancedSearchArtworks(
  params: AdvancedSearchParams
): Promise<ArtworkApiResponse> {
  const { title, artist, dateStart, dateEnd, page = 1, limit = 12 } = params;

  // Build Elasticsearch query
  const must: unknown[] = [];

  if (title?.trim()) {
    must.push({
      match: {
        title: {
          query: title.trim(),
          operator: 'and',
        },
      },
    });
  }

  if (artist?.trim()) {
    must.push({
      match: {
        artist_title: {
          query: artist.trim(),
          operator: 'and',
        },
      },
    });
  }

  if (dateStart !== undefined || dateEnd !== undefined) {
    const range: { gte?: number; lte?: number } = {};
    if (dateStart !== undefined) range.gte = dateStart;
    if (dateEnd !== undefined) range.lte = dateEnd;
    must.push({
      range: {
        date_start: range,
      },
    });
  }

  if (must.length === 0) {
    throw new Error('At least one search criterion is required');
  }

  const query = {
    query: {
      bool: {
        must,
      },
    },
    fields: [
      'id',
      'title',
      'artist_title',
      'artist_display',
      'date_display',
      'medium_display',
      'dimensions',
      'image_id',
      'thumbnail',
    ],
    page,
    limit,
  };

  const response = await fetch(`${AIC_API_BASE}/artworks/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const resData: unknown = await response.json();
  const { data, error, success } = ArtworkApiResponseSchema.safeParse(resData);

  if (!success) {
    console.error('Validation error:', z.prettifyError(error));
    throw new Error('Invalid data received from API');
  }

  return data;
}

export type ArtistInfo = {
  id: number;
  title: string;
  birth_date: number | null;
  death_date: number | null;
};

export type ArtistsApiResponse = {
  data: ArtistInfo[];
  pagination: {
    total: number;
    limit: number;
    total_pages: number;
    current_page: number;
  };
};

export async function getArtistsByLetter(
  letter: string,
  page: number = 1,
  limit: number = 50
): Promise<ArtistsApiResponse> {
  const query = {
    query: {
      bool: {
        must: [
          {
            prefix: {
              'sort_title': letter.toLowerCase(),
            },
          },
          {
            term: {
              'agent_type_id': 1, // Only artists (not organizations)
            },
          },
        ],
      },
    },
    fields: ['id', 'title', 'birth_date', 'death_date'],
    page,
    limit,
    sort: {
      'sort_title': 'asc',
    },
  };

  const response = await fetch(`${AIC_API_BASE}/agents/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const resData = await response.json() as {
    data: Array<{
      id: number;
      title?: string;
      birth_date?: number | null;
      death_date?: number | null;
    }>;
    pagination: {
      total: number;
      limit: number;
      total_pages: number;
      current_page: number;
    };
  };

  return {
    data: resData.data.map((artist) => ({
      id: artist.id,
      title: artist.title ?? 'Unknown Artist',
      birth_date: artist.birth_date ?? null,
      death_date: artist.death_date ?? null,
    })),
    pagination: resData.pagination,
  };
}

export async function getArtworkById(id: number): Promise<Artwork> {
  if (!Number.isInteger(id) || id < 1) {
    throw new Error('Invalid artwork ID');
  }

  const params = new URLSearchParams({
    fields: [
      'id',
      'title',
      'artist_title',
      'artist_display',
      'date_display',
      'medium_display',
      'dimensions',
      'image_id',
      'thumbnail',
    ].join(','),
  });

  const response = await fetch(`${AIC_API_BASE}/artworks/${id}?${params}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const resData: unknown = await response.json();

  const SingleArtworkResponseSchema = z.object({
    data: z.object({
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
    }),
  });

  const { data, error, success } = SingleArtworkResponseSchema.safeParse(resData);

  if (!success) {
    console.error('Validation error:', z.prettifyError(error));
    throw new Error('Invalid data received from API');
  }

  return data.data;
}

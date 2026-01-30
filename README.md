# Art Explorer

A React + TypeScript application for exploring the Art Institute of Chicago's collection, saving favorite artworks to a personal gallery, and adding notes.

## 🌐 Live Demo

**[https://maximilian-d-muhr.github.io/WBS-Solo-Project-Art-Explorer-App/](https://maximilian-d-muhr.github.io/WBS-Solo-Project-Art-Explorer-App/)**

## 📊 Presentation & Demo Script

- **[Art-Explorer-Presentation.pptx](./Art-Explorer-Presentation.pptx)** - Project presentation slides
- **[LIVE-DEMO-SCRIPT.md](./LIVE-DEMO-SCRIPT.md)** - 5-minute live demo walkthrough

## Features

- Search over 300,000 artworks from the Art Institute of Chicago
- **Advanced Search** with filters for artist, title, and time period
- **Artist Browser** with 160 curated notable artists
- Save favorite artworks to your personal gallery (persisted in localStorage)
- Add, edit, and delete notes on saved artworks
- Responsive, MoMA-inspired minimal design
- Full TypeScript type safety with Zod runtime validation

## Tech Stack

- **React 19** with Vite
- **TypeScript** with strict configuration
- **Zod v4** for runtime data validation
- **localStorage** for gallery persistence
- **GitHub Pages** for deployment

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── api/
│   └── artworks.api.ts    # API fetch helpers with Zod validation
├── components/
│   ├── AdvancedSearch.tsx # Multi-filter search form
│   ├── ArtistBrowser.tsx  # Alphabetical artist list
│   ├── ArtworkCard.tsx    # Reusable artwork display component
│   ├── Gallery.tsx        # Personal gallery view
│   ├── SearchBar.tsx      # Search input component
│   └── SearchResults.tsx  # Search results grid
├── hooks/
│   └── useGallery.ts      # Gallery state management with localStorage
├── schemas/
│   └── artwork.schema.ts  # Zod schemas and inferred types
└── App.tsx                # Main application component
```

## Requirements Checklist

| ID | Functional Requirement | Status | Implementation |
|----|------------------------|--------|----------------|
| FR001 | React + Vite (TypeScript) Setup | ✅ | Vite + React 19 + TypeScript |
| FR002 | Install Core Dependencies | ✅ | Zod v4.3.6 installed |
| FR003 | Artwork Zod Schema | ✅ | `src/schemas/artwork.schema.ts` - covers `id`, `title`, `artist_title`, `image_id` with defaults |
| FR004 | API Fetch with Validation | ✅ | `src/api/artworks.api.ts` - uses `safeParse()` and `z.prettifyError()` |
| FR005 | Search Interface | ✅ | `SearchBar` + `SearchResults` components |
| FR006 | ArtworkCard Component | ✅ | `src/components/ArtworkCard.tsx` - displays image, title, artist |
| FR007 | Gallery Component | ✅ | `src/components/Gallery.tsx` |
| FR008 | Create — Add to Gallery | ✅ | `useGallery.addToGallery()` → localStorage |
| FR009 | Read — Display Gallery | ✅ | Gallery renders all saved artworks using ArtworkCard |
| FR010 | Update — Notes per Artwork | ✅ | `useGallery.updateNote()` with `NoteSchema.safeParse()` validation |
| FR011 | Delete — Remove from Gallery | ✅ | `useGallery.removeFromGallery()` |
| FR012 | Type-Safe State | ✅ | All types derived via `z.infer<typeof Schema>` |

## API

This project uses the [Art Institute of Chicago API](https://www.artic.edu/open-access/public-api). (License MIT)

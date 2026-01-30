# Art Explorer - Live Demo Script
**Total Duration: approx. 4-5 minutes**

---

## 1. HOME PAGE & FREE-TEXT SEARCH (1:30 min)

### Introduction (30 sec)
> "Welcome to the Art Explorer App. This React application enables exploration of over 300,000 artworks from the Art Institute of Chicago."

### Demo: Search for "Monet" (30 sec)
**Action:** Type "Monet" in the search bar and press Enter.

> "The free-text search uses the Art Institute of Chicago's public API. Here's what happens behind the scenes:"

### Technical Explanation (30 sec)
> "The API is built on **Elasticsearch**. My search query is sent to the `/artworks/search` endpoint. The API searches multiple fields simultaneously: title, artist name, description, and keywords.

> The response is validated using **Zod** - a TypeScript schema validator. This ensures the data matches the expected format before being displayed in the app. Malformed API responses are caught and handled gracefully."

**Action:** Scroll through results, show pagination.

> "Results are loaded with pagination - 12 artworks per page. This improves performance and user experience."

---

## 2. ARTIST BROWSER & ANDY WARHOL (1:00 min)

### Navigation (10 sec)
**Action:** Click on "Artists" in the navigation.

> "On the Artists page, we see a curated list of 160 notable artists, alphabetically sorted in three columns."

### Select Artist (20 sec)
**Action:** Scroll to "W" and click on "Andy Warhol".

> "Clicking on Andy Warhol automatically opens the **Advanced Search** with the artist name pre-filled."

### All Warhol Works (15 sec)
**Action:** Click "Search".

> "Now we see all works by Andy Warhol in the collection."

### Filter: "Soup" (15 sec)
**Action:** Type "Soup" in the Title field and click Search.

> "I can further filter - for example by 'Soup' in the title. Now we only see Warhol's famous Campbell's Soup works."

---

## 3. TECHNICAL IMPLEMENTATION - API FIELDS (45 sec)

### Explanation while results are visible
> "In the code, I use different **API fields** for searching:

> - `artist_title` - for the artist name
> - `title` - for the artwork title
> - `date_start` and `date_end` - for the time period

> These are combined in an **Elasticsearch Bool Query**. This enables flexible AND-combinations of filters."

**Action:** Show briefly or explain verbally:

> "In code, this looks like: I build a `must` array with match queries for each active filter. The API then performs a combined search across all specified criteria."

---

## 4. TIME PERIOD FILTER (45 sec)

### Clear and new search (15 sec)
**Action:** Click "Clear" to reset filters.

> "I'll reset the filters."

### Year Slider Demo (30 sec)
**Action:** Activate the Year checkbox, click the "19th C." preset button.

> "The time filter uses a **range slider**. Here I select the 19th century - that's 1800 to 1900."

**Action:** Click Search.

> "The API query now contains a `range` filter on the `date_start` field. This way I find all works from this era - Impressionism, Romanticism, Realism."

---

## 5. MY GALLERY & LOCAL STORAGE (1:00 min)

### Add artwork to gallery (20 sec)
**Action:** Click the plus icon on 2-3 artworks.

> "If I like a work, I can add it to my personal gallery with one click."

### Open Gallery (15 sec)
**Action:** Click on "My Gallery" in the navigation.

> "In My Gallery I see all saved works."

### Technical Explanation (25 sec)
> "Technically, I use **localStorage** here - the browser's built-in storage. A **custom hook** called `useGallery` encapsulates all the logic:

> - `addToGallery()` - adds a work
> - `removeFromGallery()` - removes it
> - `isInGallery()` - checks if a work is already saved

> The data persists even after closing the browser - no backend, no database required."

---

## 6. CONCLUSION (15 sec)

> "In summary: This app demonstrates modern React development with TypeScript, API integration with Zod validation, and local data persistence - all wrapped in a responsive, user-friendly interface.

> Thank you!"

---

## QUICK REFERENCE - Click Sequence

1. ✅ Home page → Search "Monet"
2. ✅ Artists → Click Andy Warhol
3. ✅ Search (all Warhol works)
4. ✅ Title: "Soup" → Search
5. ✅ Clear → Activate Year → "19th C." → Search
6. ✅ Add 2-3 works to gallery (plus icon)
7. ✅ Open My Gallery

---

## EMERGENCY TIPS

- **API slow?** → "The API sometimes has latency, that's normal with public APIs"
- **No results?** → "Not every search term yields results - the collection is curated"
- **Technical question?** → Reference GitHub README or Zod/Elasticsearch documentation

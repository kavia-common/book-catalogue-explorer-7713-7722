import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

/**
 * Mock book catalogue data (frontend-only).
 * In a real app, this would come from an API.
 */
const MOCK_BOOKS = [
  {
    id: "bk_01",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    year: 1999,
    pages: 352,
    language: "English",
    format: "Paperback",
    genre: "Programming",
    tags: ["Classic", "Best practices"],
    description:
      "A practical guide to becoming a better developer. Covers habits, tools, and approaches that help you write maintainable software and adapt to change."
  },
  {
    id: "bk_02",
    title: "Clean Code",
    author: "Robert C. Martin",
    year: 2008,
    pages: 464,
    language: "English",
    format: "Hardcover",
    genre: "Programming",
    tags: ["Code quality", "Style"],
    description:
      "A handbook of agile software craftsmanship. Learn principles and patterns that encourage clean naming, small functions, and reliable design."
  },
  {
    id: "bk_03",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    year: 2017,
    pages: 616,
    language: "English",
    format: "Paperback",
    genre: "Systems",
    tags: ["Distributed systems", "Databases"],
    description:
      "A deep dive into the architecture of modern systems. Covers storage engines, replication, partitioning, stream processing, and trade-offs."
  },
  {
    id: "bk_04",
    title: "Atomic Habits",
    author: "James Clear",
    year: 2018,
    pages: 320,
    language: "English",
    format: "Paperback",
    genre: "Productivity",
    tags: ["Habits", "Self improvement"],
    description:
      "A framework for building better habits through small changes. Focuses on systems, identity, and practical strategies to make habits stick."
  },
  {
    id: "bk_05",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    year: 1937,
    pages: 310,
    language: "English",
    format: "Paperback",
    genre: "Fantasy",
    tags: ["Adventure", "Classic"],
    description:
      "Bilbo Baggins is whisked away on an epic adventure. A timeless tale of courage, friendship, and unexpected heroism."
  },
  {
    id: "bk_06",
    title: "Educated",
    author: "Tara Westover",
    year: 2018,
    pages: 352,
    language: "English",
    format: "Paperback",
    genre: "Memoir",
    tags: ["Biography", "Inspiring"],
    description:
      "A memoir about growing up in a strict and isolated environment and pursuing education against incredible odds."
  },
  {
    id: "bk_07",
    title: "Deep Work",
    author: "Cal Newport",
    year: 2016,
    pages: 304,
    language: "English",
    format: "Paperback",
    genre: "Productivity",
    tags: ["Focus", "Work"],
    description:
      "An argument for focused work in an age of distraction, with actionable methods for cultivating concentration and producing meaningful results."
  },
  {
    id: "bk_08",
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    year: 2007,
    pages: 662,
    language: "English",
    format: "Hardcover",
    genre: "Fantasy",
    tags: ["Epic", "Coming of age"],
    description:
      "The story of Kvothe, a legendary figure whose life is told in his own voice—part myth, part reality, and all captivating."
  },
  {
    id: "bk_09",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    year: 2011,
    pages: 498,
    language: "English",
    format: "Paperback",
    genre: "History",
    tags: ["Anthropology", "Big ideas"],
    description:
      "A narrative history of our species exploring how biology and history have shaped modern societies and the human experience."
  }
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "programming", label: "Programming" },
  { id: "systems", label: "Systems" },
  { id: "productivity", label: "Productivity" },
  { id: "fantasy", label: "Fantasy" },
  { id: "memoir", label: "Memoir" },
  { id: "history", label: "History" }
];

function normalizeFilterId(filterId) {
  if (!filterId || filterId === "all") return null;
  // Map filter ids to human-friendly genres present in data
  const mapping = {
    programming: "Programming",
    systems: "Systems",
    productivity: "Productivity",
    fantasy: "Fantasy",
    memoir: "Memoir",
    history: "History"
  };
  return mapping[filterId] ?? null;
}

// PUBLIC_INTERFACE
function App() {
  /** UI state */
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [activeFilterId, setActiveFilterId] = useState("all");

  /** Search state (debounced) */
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimerRef = useRef(null);

  /** Simulated loading state for nicer UX */
  const [isLoading, setIsLoading] = useState(true);

  // Simulate "fetching" from a backend while keeping the app frontend-only.
  useEffect(() => {
    const t = window.setTimeout(() => setIsLoading(false), 650);
    return () => window.clearTimeout(t);
  }, []);

  // Debounce search query updates
  useEffect(() => {
    if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(() => setSearchQuery(searchInput.trim()), 250);

    return () => {
      if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
    };
  }, [searchInput]);

  const selectedBook = useMemo(() => {
    if (!selectedBookId) return null;
    return MOCK_BOOKS.find((b) => b.id === selectedBookId) ?? null;
  }, [selectedBookId]);

  const filteredBooks = useMemo(() => {
    const genre = normalizeFilterId(activeFilterId);
    const q = searchQuery.toLowerCase();

    return MOCK_BOOKS.filter((b) => {
      const genreOk = genre ? b.genre === genre : true;
      const queryOk =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q));

      return genreOk && queryOk;
    });
  }, [activeFilterId, searchQuery]);

  // PUBLIC_INTERFACE
  function handleClearSearch() {
    setSearchInput("");
    setSearchQuery("");
  }

  // PUBLIC_INTERFACE
  function handleSelectBook(bookId) {
    setSelectedBookId(bookId);
    // Ensure detail view starts at top on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // PUBLIC_INTERFACE
  function handleBackToList() {
    setSelectedBookId(null);
    // Keep user context near the top controls
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pageTitle = selectedBook ? selectedBook.title : "Book Catalogue";

  return (
    <div className="App">
      <a className="skipLink" href="#main">
        Skip to content
      </a>

      <header className="header" aria-label="Top navigation">
        <div className="container headerInner">
          <div className="brand" aria-label="Book Catalogue Explorer">
            <div className="brandMark" aria-hidden="true" />
            <div className="brandTitle">
              <strong>Book Catalogue</strong>
              <span>Browse, search, and filter</span>
            </div>
          </div>

          <button
            className="button buttonGhost"
            type="button"
            onClick={() => {
              setActiveFilterId("all");
              handleClearSearch();
              setSelectedBookId(null);
            }}
            aria-label="Reset filters and search"
          >
            Reset
          </button>
        </div>
      </header>

      <main id="main" className="main" aria-label={pageTitle}>
        <div className="container">
          {selectedBook ? (
            <BookDetail book={selectedBook} onBack={handleBackToList} />
          ) : (
            <>
              <section className="controls" aria-label="Search and filters">
                <div className="searchRow">
                  <div className="searchBar" role="search" aria-label="Search books">
                    <input
                      className="searchInput"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search by title, author, genre, or tag…"
                      aria-label="Search books"
                    />

                    <button
                      className="iconButton"
                      type="button"
                      onClick={handleClearSearch}
                      disabled={!searchInput}
                      aria-label="Clear search"
                      title="Clear"
                    >
                      ×
                    </button>

                    <button
                      className="button buttonPrimary"
                      type="button"
                      onClick={() => setSearchQuery(searchInput.trim())}
                      aria-label="Search"
                      title="Search"
                    >
                      Search
                    </button>
                  </div>

                  <p className="helpText" aria-live="polite">
                    {searchQuery ? (
                      <>
                        Showing results for <strong>“{searchQuery}”</strong>
                      </>
                    ) : (
                      "Tip: try “fantasy”, “classic”, or an author name."
                    )}
                  </p>
                </div>

                <div className="filters" role="group" aria-label="Filter by category">
                  {FILTERS.map((f) => {
                    const active = f.id === activeFilterId;
                    return (
                      <button
                        key={f.id}
                        className={`chip ${active ? "chipActive" : ""}`}
                        type="button"
                        onClick={() => setActiveFilterId(f.id)}
                        aria-pressed={active}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              <div className="sectionTitleRow" aria-label="Catalogue summary">
                <h2 className="sectionTitle">Browse books</h2>
                <p className="sectionMeta">
                  {isLoading ? "Loading…" : `${filteredBooks.length} book${filteredBooks.length === 1 ? "" : "s"}`}
                </p>
              </div>

              {isLoading ? (
                <BookGridSkeleton />
              ) : filteredBooks.length === 0 ? (
                <EmptyState onReset={() => {
                  setActiveFilterId("all");
                  handleClearSearch();
                }} />
              ) : (
                <div className="grid" role="list" aria-label="Book list">
                  {filteredBooks.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className="card"
                      role="listitem"
                      onClick={() => handleSelectBook(b.id)}
                      aria-label={`View details for ${b.title} by ${b.author}`}
                    >
                      <div className="cover" aria-hidden="true">
                        {getCoverMonogram(b.title)}
                      </div>

                      <div>
                        <h3 className="cardTitle">{b.title}</h3>
                        <p className="cardAuthor">{b.author}</p>

                        <div className="metaRow" aria-label="Book metadata">
                          <span className="tag">{b.genre}</span>
                          <span className="tag tagAccent">{b.year}</span>
                          {b.tags.slice(0, 1).map((t) => (
                            <span key={t} className="tag">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function getCoverMonogram(title) {
  const letters = title
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return letters || "BK";
}

// PUBLIC_INTERFACE
function EmptyState({ onReset }) {
  /** Empty state view when no books match filters/search. */
  return (
    <div className="emptyState" role="status" aria-live="polite">
      <div className="emptyIllo" aria-hidden="true">
        ⌕
      </div>
      <h3 className="emptyTitle">No matches found</h3>
      <p className="emptyText">
        Try a different keyword, or remove filters to broaden your results. You can also reset everything with one tap.
      </p>
      <div style={{ marginTop: "16px" }}>
        <button className="button buttonPrimary" type="button" onClick={onReset} aria-label="Reset search and filters">
          Reset search & filters
        </button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function BookGridSkeleton() {
  /** Skeleton loading grid for list view. */
  const items = Array.from({ length: 6 }, (_, i) => i);
  return (
    <div className="grid" aria-label="Loading books" aria-busy="true">
      {items.map((i) => (
        <div key={i} className="card skeletonCard" aria-hidden="true">
          <div className="cover skel" />
          <div>
            <div className="skel skelLine" />
            <div className="skel skelLineSm" />
            <div className="skel skelLineXs" />
          </div>
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function BookDetail({ book, onBack }) {
  /** Detail view for a single book. */
  return (
    <section className="detail" aria-label="Book details">
      <button className="backButton" type="button" onClick={onBack} aria-label="Back to results">
        ← Back
      </button>

      <div className="detailCard">
        <div className="detailGrid">
          <div className="detailCover" aria-label="Book cover">
            {getCoverMonogram(book.title)}
          </div>

          <div>
            <h1 className="detailTitle">{book.title}</h1>
            <p className="detailAuthor">by {book.author}</p>

            <div className="detailMeta" aria-label="Book metadata tags">
              <span className="tag">{book.genre}</span>
              <span className="tag tagAccent">{book.year}</span>
              <span className="tag">{book.pages} pages</span>
              <span className="tag">{book.language}</span>
              <span className="tag">{book.format}</span>
              {book.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>

            <h2 className="detailDescTitle">Description</h2>
            <p className="detailDescription">{book.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;

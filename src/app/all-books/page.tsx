import Image from "next/image";
import Link from "next/link";

type Book = {
  _id?: string;
  id?: string;
  title: string;
  author: string;
  category: string;
  coverImage?: string;
  rating?: number;
  availableCopies?: number;
  totalCopies?: number;
};

const categories = [
  "All",
  "Fiction",
  "Non-Fiction",
  "Science",
  "Technology",
  "History",
];

const fallbackImage =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80";

function getCoverImage(url?: string): string {
  if (!url) return fallbackImage;

  // Bing image search URLs contain the real image in the `mediaurl` param
  if (url.includes("bing.com/images/search")) {
    try {
      const match = url.match(/mediaurl=([^&]+)/);
      if (match) {
        return decodeURIComponent(match[1]);
      }
    } catch {
      // fall through to fallback
    }
    return fallbackImage;
  }

  // Accept direct image links
  if (/\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/i.test(url)) {
    return url;
  }

  return fallbackImage;
}

export default async function AllBooksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const query = params?.q?.trim() || "";
  const selectedCategory = params?.category || "All";

  let books: Book[] = [];
  let error = "";

  try {
    const res = await fetch("http://localhost:9000/all-books", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch books");
    }

    const data = await res.json();

    books = Array.isArray(data) ? data : data.books || data.data || [];
  } catch (err) {
    console.error(err);
    error = "Failed to load books. Please try again later.";
  }

  const filteredBooks = books.filter((book) => {
    const matchesQuery =
      !query ||
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || book.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const hasActiveFilter = query !== "" || selectedCategory !== "All";

  return (
    <main className='min-h-screen bg-[#050714] px-4 py-10 text-slate-300 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl space-y-8'>
        {/* Header & Search */}
        <section className='flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-800/80 bg-[#0b1021] p-6 shadow-xl md:flex-row md:items-center md:p-8'>
          <div className='space-y-2'>
            <h1 className='text-2xl font-bold tracking-tight text-white'>
              Library Catalog
            </h1>

            <p className='text-xs text-slate-400'>
              Explore and borrow books available in the BookNook ecosystem.
            </p>

            <p className='text-xs font-medium text-indigo-400'>
              {filteredBooks.length} Books Available in Catalog
            </p>
          </div>

          <form
            method='GET'
            action='/all-books'
            className='relative w-full md:w-80'>
            {selectedCategory !== "All" && (
              <input type='hidden' name='category' value={selectedCategory} />
            )}
            <svg
              className='absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='2'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>

            <input
              type='text'
              name='q'
              defaultValue={query}
              placeholder='Search by title or author...'
              aria-label='Search books'
              className='w-full rounded-xl border border-slate-800 bg-[#050714] py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-500'
            />

            {hasActiveFilter && (
              <button
                type='submit'
                className='absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-indigo-600 px-3 py-1.5 text-[10px] font-semibold text-white transition-colors hover:bg-indigo-500'>
                Search
              </button>
            )}
          </form>
        </section>

        {/* Category Filters */}
        <section className='space-y-3'>
          <div className='flex items-center gap-2 text-sm font-semibold text-white'>
            <svg
              className='h-4 w-4 text-indigo-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='2'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3 4h18M6 8h12m-9 4h6m-3 4h1'
              />
            </svg>
            Browse Categories
          </div>

          <div className='flex items-center gap-2 overflow-x-auto pb-2'>
            {categories.map((category) => {
              const isActive = category === selectedCategory;
              const href = `/all-books?category=${category === "All" ? "" : category}${query ? `&q=${encodeURIComponent(query)}` : ""}`;
              return (
                <Link
                  key={category}
                  href={href}
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-[#5b51d8] text-white shadow-md shadow-indigo-500/20"
                      : "border border-slate-800 bg-[#0b1021] text-slate-400 hover:border-indigo-500/50 hover:text-white"
                  }`}>
                  {category}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Error Message */}
        {error ? (
          <div className='rounded-2xl border border-rose-900/50 bg-rose-950/20 p-8 text-center'>
            <p className='font-semibold text-rose-400'>{error}</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          /* Empty State */
          <div className='rounded-2xl border border-slate-800 bg-[#0b1021] px-5 py-20 text-center'>
            <h2 className='text-xl font-bold text-white'>No Books Found</h2>

            <p className='mt-2 text-sm text-slate-400'>
              {hasActiveFilter
                ? "Try adjusting your search or category filter."
                : "There are currently no books available in the library."}
            </p>

            {hasActiveFilter && (
              <Link
                href='/all-books'
                className='mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500'>
                Clear Filters
              </Link>
            )}

            {!hasActiveFilter && (
              <Link
                href='/add-book'
                className='mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500'>
                Add New Book
              </Link>
            )}
          </div>
        ) : (
          /* Books Grid */
          <section className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredBooks.map((book, index) => {
              const bookId = book._id ?? book.id ?? String(index);
              const available = book.availableCopies ?? book.totalCopies;

              return (
                <article
                  key={bookId}
                  className='group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1021] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-indigo-950/30'>
                  {/* Book Cover */}
                  <div className='relative flex h-56 items-center justify-center overflow-hidden bg-slate-900/60 p-4'>
                    {/* Category */}
                    <span className='absolute left-3 top-3 z-10 rounded-md border border-slate-700/60 bg-slate-900/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md'>
                      {book.category}
                    </span>

                    {/* Rating */}
                    {book.rating != null && (
                      <span className='absolute right-3 top-3 z-10 flex items-center gap-1 rounded-md bg-amber-500 px-2 py-1 text-[11px] font-bold text-slate-950'>
                        ★ {book.rating}
                      </span>
                    )}

                    <Image
                      src={getCoverImage(book.coverImage)}
                      alt={book.title}
                      fill
                      unoptimized
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      className='rounded-lg object-cover object-center transition-transform duration-500 group-hover:scale-105'
                    />

                    {/* Availability Badge */}
                    <span
                      className={`absolute bottom-3 left-3 z-10 rounded-md border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md ${
                        available === undefined
                          ? "border-slate-700 bg-slate-900/90 text-slate-300"
                          : available > 0
                            ? "border-emerald-800/60 bg-emerald-950/90 text-emerald-300"
                            : "border-rose-800/60 bg-rose-950/90 text-rose-300"
                      }`}>
                      {available === undefined
                        ? "Availability Unknown"
                        : available > 0
                          ? `${available} Copies Left`
                          : "Not Available"}
                    </span>
                  </div>

                  {/* Book Information */}
                  <div className='flex flex-grow flex-col justify-between space-y-5 p-5'>
                    <div className='space-y-2'>
                      <h2 className='line-clamp-1 text-base font-bold tracking-tight text-white transition-colors group-hover:text-indigo-400'>
                        {book.title}
                      </h2>

                      <p className='text-xs text-slate-400'>by {book.author}</p>
                    </div>

                    {/* Card Footer */}
                    <div className='flex items-center justify-between border-t border-slate-800/80 pt-4'>
                      <span
                        className={`text-xs font-semibold ${
                          available === undefined
                            ? "text-slate-400"
                            : available > 0
                              ? "text-emerald-400"
                              : "text-rose-400"
                        }`}>
                        {available === undefined
                          ? "Check Availability"
                          : `${available} Available`}
                      </span>

                      <Link
                        href={`/all-books/${bookId}`}
                        className='rounded-lg border border-slate-800 bg-[#050714] px-3.5 py-2 text-xs font-semibold text-white transition-all hover:border-indigo-500 hover:bg-indigo-600'>
                        View Details →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

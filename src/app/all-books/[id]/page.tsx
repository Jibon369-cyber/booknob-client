import Image from "next/image";
import Link from "next/link";

type Book = {
  _id?: string;
  id?: string;
  title: string;
  author: string;
  category: string;
  coverImage?: string;
  description?: string;
  addedBy?: string | { name?: string };
  rating?: number;
  availableCopies?: number;
  totalCopies?: number;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80";

function getCoverImage(url?: string): string {
  if (!url) return fallbackImage;

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

  if (/\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/i.test(url)) {
    return url;
  }

  return fallbackImage;
}

const BookDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  let book: Book | null = null;
  let error = "";

  try {
    const res = await fetch(`http://localhost:9000/book/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch book details");
    }

    book = await res.json();
  } catch (err) {
    console.error(err);
    error = "Failed to load book details. Please try again later.";
  }

  if (error || !book) {
    return (
      <main className='min-h-screen bg-white dark:bg-[#050714] px-4 py-12 text-slate-900 dark:text-slate-300'>
        <div className='mx-auto max-w-6xl'>
          <Link
            href='/all-books'
            className='mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition'>
            ← Back to Books
          </Link>
          <div className='rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 p-8 text-center'>
            <p className='font-semibold text-rose-600 dark:text-rose-400'>
              {error || "Book not found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const addedBy =
    typeof book.addedBy === "object" ? book.addedBy?.name : book.addedBy;

  const available = book.availableCopies ?? book.totalCopies;

  return (
    <main className='min-h-screen bg-white dark:bg-[#050714] px-4 py-12 text-slate-900 dark:text-slate-300'>
      <div className='mx-auto max-w-6xl'>
        {/* Back Button */}
        <Link
          href='/all-books'
          className='mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition'>
          ← Back to Books
        </Link>

        {/* Details Card */}
        <div className='grid overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1021] shadow-xl md:grid-cols-2'>
          {/* Book Image */}
          <div className='flex min-h-[350px] items-center justify-center bg-slate-100 dark:bg-slate-900/60 p-8 md:p-12'>
            <Image
              src={getCoverImage(book.coverImage)}
              alt={book.title}
              height={400}
              width={300}
              unoptimized
              className='max-h-[450px] w-full max-w-sm rounded-xl object-contain shadow-2xl'
            />
          </div>

          {/* Book Information */}
          <div className='flex flex-col justify-center p-6 md:p-10 lg:p-14'>
            {/* Category */}
            <span className='mb-5 w-fit rounded-full border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-900/90 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white'>
              {book.category}
            </span>

            {/* Title */}
            <h1 className='mb-4 text-3xl font-bold leading-tight text-slate-900 dark:text-white md:text-4xl'>
              {book.title}
            </h1>

            {/* Author */}
            <p className='mb-6 text-lg text-slate-500 dark:text-slate-400'>
              By{" "}
              <span className='font-semibold text-slate-900 dark:text-white'>{book.author}</span>
            </p>

            <div className='mb-6 h-px w-full bg-slate-200 dark:bg-slate-800/80' />

            {/* Description */}
            <div className='mb-8'>
              <h2 className='mb-3 text-xl font-bold text-slate-900 dark:text-white'>
                About This Book
              </h2>

              <p className='leading-8 text-slate-600 dark:text-slate-400'>
                {book.description || "No description available."}
              </p>
            </div>

            {/* Availability */}
            {available !== undefined && (
              <div className='mb-8 flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#050714] p-4'>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${
                    available > 0
                      ? "bg-emerald-100 dark:bg-emerald-950/90 text-emerald-700 dark:text-emerald-300"
                      : "bg-rose-100 dark:bg-rose-950/90 text-rose-700 dark:text-rose-300"
                  }`}>
                  {available}
                </div>

                <div>
                  <p className='text-xs text-slate-500 dark:text-slate-500'>Copies Available</p>
                  <p className='font-bold text-slate-900 dark:text-white'>
                    {available > 0 ? `${available} Available` : "Not Available"}
                  </p>
                </div>
              </div>
            )}

            {/* Added By */}
            <div className='mb-8 flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#050714] p-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white'>
                {(addedBy || "U").charAt(0).toUpperCase()}
              </div>

              <div>
                <p className='text-xs text-slate-500 dark:text-slate-500'>Added to Library By</p>

                <p className='font-bold text-slate-900 dark:text-white'>{addedBy || "Unknown User"}</p>
              </div>
            </div>

            {/* Borrow Button */}
            <button
              type='button'
              className='w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 hover:shadow-lg'>
              Borrow This Book
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookDetailsPage;
"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  BookOpen,
  Pencil,
  Trash2,
  Plus,
  Library,
  BookMarked,
  Sparkles,
  X,
  UserRound,
  Search,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Book = {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
  image?: string;
  cover?: string;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80";

function getCoverImage(url?: string): string {
  if (!url) return fallbackImage;
  if (url.includes("bing.com/images/search")) {
    try {
      const match = url.match(/mediaurl=([^&]+)/);
      if (match) return decodeURIComponent(match[1]);
    } catch {}
    return fallbackImage;
  }
  if (/\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/i.test(url)) return url;
  return fallbackImage;
}

const MyBooks = () => {
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    document.title = "BookNook | My Books";
  }, []);

  const [books, setBooks] = useState<Book[]>([]);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState<Partial<Book>>({});

  const loadBooks = async () => {
    if (!user?.email) return;

    const res = await fetch(
      `http://localhost:9000/my-books?email=${encodeURIComponent(user.email)}`,
    );

    const data = await res.json();
    const list = Array.isArray(data) ? data : data.books || data.data || [];
    console.log("MY BOOKS DATA:", list);
    setBooks(list);
  };

  useEffect(() => {
    if (user?.email) loadBooks();
  }, [user]);

  const openEdit = (book: Book) => {
    setEditing(book);
    setForm({ ...book });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editing) return;

    const { _id, ...payload } = form as any;

    const res = await fetch(
      `http://localhost:9000/update-book/${editing._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (res.ok) {
      toast.success("Book updated successfully");
      setEditing(null);
      loadBooks();
    } else {
      toast.error("Update failed");
    }
  };

  const confirmDelete = (book: Book) => {
    Swal.fire({
      title: "Delete this book?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Keep Book",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      background: "#ffffff",
      color: "#1e293b",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-lg px-5 py-2.5",
        cancelButton: "rounded-lg px-5 py-2.5",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(
          `http://localhost:9000/delete-book/${book._id}`,
          {
            method: "DELETE",
          },
        );

        if (res.ok) {
          setBooks((prev) => prev.filter((b) => b._id !== book._id));

          toast.success("Book deleted");
        } else {
          toast.error("Delete failed");
        }
      }
    });
  };

  return (
    <main className='min-h-screen bg-slate-50 dark:bg-[#080d1a] px-4 py-10 md:px-8 lg:px-12'>
      <div className='max-w-7xl mx-auto'>
        {/* HERO SECTION */}
        <section className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-7 md:p-10 shadow-xl shadow-indigo-500/10'>
          <div className='absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl' />
          <div className='absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-purple-300/20 blur-3xl' />

          <div className='relative z-10 flex flex-col justify-between gap-7 md:flex-row md:items-center'>
            <div>
              <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white'>
                <Sparkles size={15} />
                Personal Library
              </div>

              <h1 className='text-3xl font-bold tracking-tight text-white md:text-5xl'>
                My Books
              </h1>

              <p className='mt-3 max-w-xl text-sm leading-6 text-indigo-100 md:text-base'>
                Manage your personal book collection, update your information
                and keep your library organized.
              </p>

              {user && (
                <p className='mt-5 flex items-center gap-2 text-sm text-indigo-100'>
                  <UserRound size={16} />
                  Welcome back, {user.name || user.email}
                </p>
              )}
            </div>

            <Link
              href='/add-book'
              className='inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-indigo-700 shadow-lg transition-all hover:-translate-y-1 hover:bg-indigo-50'>
              <Plus size={19} />
              Add New Book
            </Link>
          </div>
        </section>

        {/* STATISTICS */}
        <section className='mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2'>
          <div className='flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]'>
            <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400'>
              <Library size={27} />
            </div>

            <div>
              <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                Total Books
              </p>

              <h2 className='mt-1 text-3xl font-bold text-slate-900 dark:text-white'>
                {books.length}
              </h2>
            </div>
          </div>

          <div className='flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]'>
            <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400'>
              <BookMarked size={27} />
            </div>

            <div>
              <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                Collection Status
              </p>

              <h2 className='mt-1 text-xl font-bold text-slate-900 dark:text-white'>
                {books.length > 0 ? "Active Library" : "Empty Library"}
              </h2>
            </div>
          </div>
        </section>

        {/* SECTION HEADER */}
        <section className='mt-12 mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end'>
          <div>
            <div className='flex items-center gap-2'>
              <BookOpen
                className='text-indigo-600 dark:text-indigo-400'
                size={22}
              />

              <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>
                Your Collection
              </h2>
            </div>

            <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
              All the books you have added to BookNook.
            </p>
          </div>

          <span className='w-fit rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'>
            {books.length} {books.length === 1 ? "Book" : "Books"}
          </span>
        </section>

        {/* EMPTY STATE */}
        {books.length === 0 && (
          <div className='rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center dark:border-slate-700 dark:bg-[#111827]'>
            <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400'>
              <BookOpen size={38} />
            </div>

            <h3 className='text-2xl font-bold text-slate-900 dark:text-white'>
              Your library is empty!
            </h3>

            <p className='mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400'>
              You haven't added any books yet. Start building your personal
              library by adding your first book.
            </p>

            <Link
              href='/add-book'
              className='mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700'>
              <Plus size={18} />
              Add Your First Book
            </Link>
          </div>
        )}

        {/* BOOK CARDS */}
        {books.length > 0 && (
          <section className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {books.map((book, index) => (
              <div
                key={book._id}
                className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 dark:border-slate-800 dark:bg-[#111827] dark:hover:border-indigo-500/40'>
                {/* TOP */}
                <div className='mb-6 flex items-center justify-between'>
                  <div className='flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400'>
                    <Image
                      src={getCoverImage((book as any).coverImage)}
                      alt={book.title}
                      width={70}
                      height={70}
                      unoptimized
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                  </div>

                  <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400'>
                    BOOK #{index + 1}
                  </span>
                </div>

                {/* BOOK INFORMATION */}
                <div className='min-h-24'>
                  <h3 className='line-clamp-2 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400'>
                    {book.title}
                  </h3>

                  <div className='mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400'>
                    <UserRound size={16} />
                    <span className='line-clamp-1'>{book.author}</span>
                  </div>
                </div>

                <div className='my-6 h-px bg-slate-100 dark:bg-slate-800' />

                {/* ACTIONS */}
                <div className='flex gap-3'>
                  <button
                    onClick={() => openEdit(book)}
                    className='flex flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition-all hover:bg-indigo-600 hover:text-white dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white'>
                    <Pencil size={16} />
                    Edit Book
                  </button>

                  <button
                    onClick={() => confirmDelete(book)}
                    className='flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white'>
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm'>
          <form
            onSubmit={handleUpdate}
            className='w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#111827]'>
            {/* MODAL HEADER */}
            <div className='flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5'>
              <div>
                <h2 className='text-xl font-bold text-white'>Edit Book</h2>

                <p className='mt-1 text-sm text-indigo-100'>
                  Update your book information.
                </p>
              </div>

              <button
                type='button'
                onClick={() => setEditing(null)}
                className='flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25'>
                <X size={19} />
              </button>
            </div>

            {/* FORM BODY */}
            <div className='space-y-5 p-6'>
              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200'>
                  Book Title
                </label>

                <input
                  className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-[#080d1a] dark:text-white'
                  value={form.title || ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder='Enter book title'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200'>
                  Author Name
                </label>

                <input
                  className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-[#080d1a] dark:text-white'
                  value={form.author || ""}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder='Enter author name'
                />
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className='flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-[#0d1424]'>
              <button
                type='button'
                onClick={() => setEditing(null)}
                className='rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'>
                Cancel
              </button>

              <button
                type='submit'
                className='rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700'>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default MyBooks;

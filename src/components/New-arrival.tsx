"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  coverImage?: string;
};

function getCoverImage(url?: string) {
  if (!url) return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80";
  if (url.includes("bing.com/images/search")) {
    const m = url.match(/mediaurl=([^&]+)/);
    if (m) return decodeURIComponent(m[1]);
  }
  return url;
}

export default function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:9000/all-books")
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : d.books || d.data || [];
        // newest first (by _id) then limit 6
        const sorted = [...list].sort((a, b) =>
          String(b._id).localeCompare(String(a._id))
        );
        setBooks(sorted.slice(0, 6));
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">New Arrivals</h2>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="border rounded-2xl p-4 shadow-sm bg-white dark:bg-[#111827]"
          >
            <Image
              src={getCoverImage(book.coverImage)}
              alt={book.title}
              width={300}
              height={200}
              unoptimized
              className="w-full h-48 object-cover rounded-xl"
            />
            <h3 className="mt-3 font-bold">{book.title}</h3>
            <p className="text-sm text-slate-500">by {book.author}</p>
            <p className="text-xs text-slate-400 mt-1">{book.category}</p>
            <Link
              href={`/all-books/${book._id}`}
              className="mt-3 inline-block text-indigo-600 font-semibold"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
      )}
      <div className="mt-8 text-center">
        <Link
          href="/all-books"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl"
        >
          See All Books
        </Link>
      </div>
    </section>
  );
}
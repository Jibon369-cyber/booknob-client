"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  coverImage?: string;
  availableCopies?: number;
  totalCopies?: number;
  description?: string;
};

function getCoverImage(url?: string) {
  const fallback = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80";
  if (!url) return fallback;
  if (url.includes("bing.com/images/search")) {
    const m = url.match(/mediaurl=([^&]+)/);
    if (m) return decodeURIComponent(m[1]);
  }
  if (/^https?:\/\//i.test(url)) return url;
  return fallback;
}

export default function BookDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: session } = useSession();
  const user = session?.user;
  const [book, setBook] = useState<Book | null>(null);
  const [loadError, setLoadError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/book/${encodeURIComponent(id)}`,
        );

        if (!res.ok) {
          throw new Error(`Failed to load book (${res.status})`);
        }

        setBook(await res.json());
      } catch (error) {
        console.error(error);
        setLoadError("Unable to load this book. Please try again.");
      }
    };

    fetchBook();
  }, [id]);

  

  // removed invalid effect

  const handleBorrow = async () => {
    if (!book || !user) return;
    // no double borrow
    const resBorrows = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/my-borrows`,
    );
    if (!resBorrows.ok) {
      toast.error("Could not check your borrows");
      return;
    }
    const data = await resBorrows.json();
    const list = Array.isArray(data) ? data : data.borrows || data.data || [];
    if (list.some((b: any) => b.bookId === book._id)) {
      toast.error("You already borrowed this book");
      return;
    }
    if ((book.availableCopies ?? book.totalCopies ?? 1) <= 0) {
      toast.error("Not available");
      return;
    }
    const borrowDate = new Date().toISOString();
    const returnDate = new Date(
      Date.now() + 14 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/borrow`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId: book._id,
        bookTitle: book.title,
        bookImage: getCoverImage(book.coverImage),
        userEmail: user.email,
        borrowDate,
        returnDate,
      }),
    });
    if (res.ok) {
      toast.success("Book borrowed!");
      setBook((prev) =>
        prev
          ? {
              ...prev,
              availableCopies: Math.max(
                0,
                (prev.availableCopies ?? prev.totalCopies ?? 1) - 1
              ),
            }
          : prev
      );
      setOpen(false);
    } else {
      toast.error("Borrow failed");
    }
  };

  if (loadError)
    return <div className='p-10 text-center text-red-500'>{loadError}</div>;

  if (!book)
    return <div className='p-10 text-center text-slate-400'>Loading...</div>;

  return (
    <main className='min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-4 md:p-8'>
      <div className='bg-[#111625] rounded-3xl p-6 md:p-10 max-w-4xl w-full border border-slate-800 shadow-2xl relative'>
        <div className='flex flex-col md:flex-row gap-8 items-stretch'>
          {/* Left Side: Yellow Card Banner with Book Cover */}
          <div className='bg-[#FFCC00] rounded-2xl p-6 flex items-center justify-center flex-shrink-0 md:w-80 shadow-lg'>
            <div className='relative w-48 h-72 rounded-lg overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-300'>
              <Image
                src={getCoverImage(book.coverImage)}
                alt={book.title}
                fill
                unoptimized
                className='object-cover'
              />
            </div>
          </div>

          {/* Right Side: Book Details */}
          <div className='flex flex-col justify-between flex-1 py-2'>
            <div>
              {/* Category Pill */}
              <span className='inline-block px-4 py-1.5 rounded-full bg-[#1A2238] text-indigo-300 text-xs font-semibold tracking-wide mb-4'>
                {book.category}
              </span>

              {/* Title & Author */}
              <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-1'>
                {book.title}
              </h1>
              <p className='text-slate-400 text-base mb-4 font-medium'>
                Author: <span className='text-slate-300'>{book.author}</span>
              </p>

              {/* Rating & Availability */}
              <div className='flex items-center gap-3 text-sm font-semibold mb-6'>
                <div className='flex items-center gap-1.5 text-amber-400'>
                  <Star className='w-4 h-4 fill-amber-400 stroke-amber-400' />
                  <span>4.9</span>
                </div>
                <span className='text-slate-600'>•</span>
                <span className='text-emerald-400'>
                  {book.availableCopies ?? book.totalCopies ?? 0} Copies left
                </span>
              </div>

              {/* Description */}
              <p className='text-slate-400 text-sm leading-relaxed mb-6'>
                {book.description || "No description available."}
              </p>
            </div>

            {/* Borrow Action Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger
                render={
                  <Button
                    disabled={(book.availableCopies ?? book.totalCopies ?? 1) <= 0}
                    className='w-full bg-[#FFB800] hover:bg-[#E6A600] text-black font-bold text-base py-6 rounded-2xl shadow-lg transition-all duration-200 disabled:opacity-50'
                  />
                }
              >
                {(book.availableCopies ?? book.totalCopies ?? 1) <= 0
                  ? "Not Available"
                  : "Borrow This Book Now"}
              </DialogTrigger>
              <DialogContent className='bg-[#111625] text-white border-slate-800 sm:rounded-2xl'>
                <DialogHeader>
                  <DialogTitle className='text-xl font-bold text-white'>
                    Borrow Book
                  </DialogTitle>
                </DialogHeader>
                <div className='space-y-4 pt-2'>
                  <Input
                    value={user?.name || ""}
                    readOnly
                    placeholder='User Name'
                    className='bg-[#1A2238] border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-amber-400'
                  />
                  <Input
                    value={user?.email || ""}
                    readOnly
                    placeholder='User Email'
                    className='bg-[#1A2238] border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-amber-400'
                  />
                  <Button
                    onClick={handleBorrow}
                    className='w-full bg-[#FFB800] hover:bg-[#E6A600] text-black font-bold py-5 rounded-xl transition-all duration-200'>
                    Confirm Borrow
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </main>
  );
}

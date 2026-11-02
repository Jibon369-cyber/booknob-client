"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Image from "next/image";

type Borrow = {
  _id: string;
  bookTitle: string;
  bookImage?: string;
  borrowDate: string;
  returnDate: string;
};

function getCoverImage(url?: string) {
  if (!url) return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80";
  if (url.includes("bing.com/images/search")) {
    const m = url.match(/mediaurl=([^&]+)/);
    if (m) return decodeURIComponent(m[1]);
  }
  return url;
}

export default function MyBorrowsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [borrows, setBorrows] = useState<Borrow[]>([]);

  const load = async () => {
    if (!user?.email) return;
    const res = await fetch(
      `http://localhost:9000/my-borrows?email=${encodeURIComponent(user.email)}`
    );
    const data = await res.json();
    setBorrows(Array.isArray(data) ? data : data.borrows || data.data || []);
  };

  useEffect(() => {
    if (user?.email) load();
  }, [user]);

  const handleReturn = async (b: Borrow) => {
    const res = await fetch(`http://localhost:9000/return-book/${b._id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setBorrows((prev) => prev.filter((x) => x._id !== b._id));
      toast.success("Book returned");
    } else {
      toast.error("Return failed");
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Borrows</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Borrow Date</th>
              <th className="p-3 text-left">Return Date</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {borrows.map((b) => (
              <tr key={b._id} className="border-b">
                <td className="p-3">
                  <Image
                    src={getCoverImage(b.bookImage)}
                    alt={b.bookTitle}
                    width={60}
                    height={80}
                    unoptimized
                    className="rounded"
                  />
                </td>
                <td className="p-3">{b.bookTitle}</td>
                <td className="p-3">
                  {new Date(b.borrowDate).toLocaleDateString()}
                </td>
                <td className="p-3">
                  {new Date(b.returnDate).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleReturn(b)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Return Book
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useToastManager } from "@/components/ui/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

type Book = {
  _id?: string;
  id?: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  coverImage: string;
  description?: string;
};

const categories = ["Fiction", "Non-Fiction", "Science", "History", "Technology"];

const fallbackImage =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80";

function getCoverImage(url?: string) {
  return url && url.trim() ? url : fallbackImage;
}

export default function MyBooksPage() {
  const { data: session } = useSession();
  const toastManager = useToastManager();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "Fiction",
    totalCopies: 5,
    coverImage: "",
    description: "",
  });

  const userEmail = session?.user?.email;

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `http://localhost:9000/my-books?email=${encodeURIComponent(userEmail)}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : data.books || data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [userEmail]);

  const bookId = (b: Book) => b._id ?? b.id ?? "";

  const openEdit = (b: Book) => {
    setEditing(b);
    setForm({
      title: b.title,
      author: b.author,
      category: b.category,
      totalCopies: b.totalCopies,
      coverImage: b.coverImage,
      description: b.description ?? "",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const id = bookId(editing);
    const res = await fetch(`http://localhost:9000/update-book/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setBooks((prev) =>
        prev.map((b) => (bookId(b) === id ? { ...b, ...form } : b))
      );
      setEditing(null);
      toastManager.add({ title: "Book updated successfully" });
    } else {
      toastManager.add({ title: "Failed to update book" });
    }
  };

  const handleDelete = async (b: Book) => {
    const id = bookId(b);
    const res = await fetch(`http://localhost:9000/delete-book/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setBooks((prev) => prev.filter((x) => bookId(x) !== id));
      toastManager.add({ title: "Book deleted" });
    } else {
      toastManager.add({ title: "Failed to delete book" });
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-white dark:bg-[#050714] px-4 py-10 text-slate-900 dark:text-slate-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <h1 className="text-2xl font-bold">My Books</h1>

        {books.length === 0 ? (
          <p className="text-slate-500">You haven't added any books yet.</p>
        ) : (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <article
                key={bookId(book)}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1021] shadow-xl"
              >
                <div className="relative h-56 bg-slate-100 dark:bg-slate-900/60">
                  <Image
                    src={getCoverImage(book.coverImage)}
                    alt={book.title}
                    fill
                    unoptimized
                    sizes="33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-grow flex-col justify-between space-y-4 p-5">
                  <div>
                    <h2 className="text-base font-bold">{book.title}</h2>
                    <p className="text-xs text-slate-500">by {book.author}</p>
                    <p className="text-xs text-slate-400 mt-1">{book.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={editing !== null && bookId(editing) === bookId(book)}
                      onOpenChange={(o) => {
                        if (!o) setEditing(null);
                      }}
                    >
                      <DialogTrigger
                        render={
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(book)}
                          />
                        }
                      >
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Book</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-3">
                          <Input
                            value={form.title}
                            onChange={(e) =>
                              setForm({ ...form, title: e.target.value })
                            }
                            placeholder="Title"
                            required
                          />
                          <Input
                            value={form.author}
                            onChange={(e) =>
                              setForm({ ...form, author: e.target.value })
                            }
                            placeholder="Author"
                            required
                          />
                          <select
                            value={form.category}
                            onChange={(e) =>
                              setForm({ ...form, category: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <Input
                            type="number"
                            value={form.totalCopies}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                totalCopies: Number(e.target.value),
                              })
                            }
                            required
                          />
                          <Input
                            value={form.coverImage}
                            onChange={(e) =>
                              setForm({ ...form, coverImage: e.target.value })
                            }
                            placeholder="Cover Image URL"
                            required
                          />
                          <textarea
                            value={form.description}
                            onChange={(e) =>
                              setForm({ ...form, description: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            rows={3}
                          />
                          <Button type="submit" className="w-full">
                            Save Changes
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger
                        render={<Button variant="destructive" size="sm" />}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this book?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The book will be
                            removed from the library.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(book)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

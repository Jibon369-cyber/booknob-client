'use client'
"import React, useState";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function AddBookForm(): React.JSX.Element {
  useEffect(() => {
    document.title = "BookNook | Add Book";
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Fiction",
    totalCopies: 5,
    coverImage: "",
    description: "",
  });

  const router = useRouter();
   const { data: session } = useSession();
   const user = session?.user;

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();

     const payload = {
       ...formData,
       addedBy: user?.email, 
     };

     const res = await fetch("http://localhost:9000/add-book", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(payload),
     });

     const data = await res.json();

     if (data) {
       router.push("/my-books"); // redirect to my-books to verify
     }
   };

  return (
    <div className='min-h-screen bg-white dark:bg-[#050714] flex items-center justify-center p-6 text-black'>
      <div className='w-full max-w-2xl bg-white dark:bg-[#0b1021] border border-slate-800/80 rounded-2xl p-8 shadow-2xl'>
        {/* Header Section */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-black dark:text-white tracking-tight'>
            Add a New Book
          </h1>
          <p className='text-xs text-slate-400 mt-1'>
            Contribute to the BookNook library by listing a book and total
            copies.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* Row 1: Book Title & Author Name */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='block text-xs font-medium text-slate-300'>
                Book Title <span className='text-indigo-400'>*</span>
              </label>
              <input
                type='text'
                placeholder='e.g. The Great Gatsby'
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className='w-full dark:bg-[#050714] dark:text-white border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs bg-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors'
                required
              />
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-medium text-slate-300'>
                Author Name <span className='text-indigo-400'>*</span>
              </label>
              <input
                type='text'
                placeholder='e.g. F. Scott Fitzgerald'
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className='w-full bg-white dark:bg-[#050714] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors'
                required
              />
            </div>
          </div>

          {/* Row 2: Category & Total Copies */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='block text-xs font-medium text-slate-300'>
                Category <span className='text-indigo-400'>*</span>
              </label>
              <div className='relative'>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className='w-full bg-white dark:bg-[#050714] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-black dark:text-white appearance-none focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer'>
                  <option value='Fiction'>Fiction</option>
                  <option value='Non-Fiction'>Non-Fiction</option>
                  <option value='Science'>Science</option>
                  <option value='History'>History</option>
                  <option value='Technology'>Technology</option>
                </select>
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth='2'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className='space-y-1.5'>
              <div className='flex justify-between items-center'>
                <label className='block text-xs font-medium text-slate-300'>
                  Total Copies <span className='text-indigo-400'>*</span>
                </label>
                <span className='text-[10px] font-semibold text-amber-500 tracking-wide uppercase'>
                  Inventory Stock
                </span>
              </div>
              <input
                type='number'
                min='1'
                value={formData.totalCopies}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalCopies: Number(e.target.value),
                  })
                }
                className='w-full bg-white dark:bg-[#050714] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-black dark:text-white focus:outline-none focus:border-indigo-500 transition-colors'
                required
              />
            </div>
          </div>

          {/* Row 3: Cover Image URL */}
          <div className='space-y-1.5'>
            <label className='block text-xs font-medium text-slate-300'>
              Cover Image URL <span className='text-indigo-400'>*</span>
            </label>
            <input
              type='url'
              placeholder='https://images.unsplash.com/...'
              value={formData.coverImage}
              onChange={(e) =>
                setFormData({ ...formData, coverImage: e.target.value })
              }
              className='w-full bg-white dark:bg-[#050714] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-black dark:text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors'
              required
            />
          </div>

          {/* Row 4: Short Description */}
          <div className='space-y-1.5'>
            <label className='block text-xs font-medium text-slate-300'>
              Short Description
            </label>
            <textarea
              rows={4}
              placeholder='Provide a brief synopsis of the book...'
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className='w-full bg-white dark:bg-[#050714] border border-slate-800 rounded-lg p-3.5 text-xs text-black dark:text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none'
            />
          </div>

          {/* Submit Button */}
          <div className='pt-2'>
            <button
              type='submit'
              className='w-full bg-[#5b51d8] hover:bg-[#4f46e5] text-white font-medium text-xs py-3 rounded-lg shadow-lg shadow-indigo-500/20 transition-all duration-200'>
              Add Book to Library
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

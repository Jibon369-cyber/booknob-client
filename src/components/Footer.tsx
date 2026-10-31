import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer(): React.JSX.Element {
  return (
    <footer className='w-full bg-[#1a2333] text-slate-300 text-sm py-12 px-6 border-t border-slate-800/60'>
      <div className='max-w-7xl mx-auto'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10'>
          {/* Column 1: Brand Info */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-lg bg-[#5b51d8] flex items-center justify-[#5b51d8] justify-center text-white shadow-lg shadow-indigo-500/20'>
                <Image
                  src='/booknook-logo.png'
                  width={60}
                  height={60}
                  alt='logo'
                />
              </div>
              <span className='text-xl font-bold text-white tracking-tight'>
                BookNook
              </span>
            </div>
            <p className='text-slate-400 text-xs leading-relaxed max-w-xs'>
              A modern online community library. Discover new worlds, lend your
              favorite reads, and borrow literature securely with JWT auth.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className='space-y-3'>
            <h3 className='text-xs font-bold text-white tracking-wider uppercase'>
              NAVIGATION
            </h3>
            <ul className='space-y-2 text-xs text-slate-400'>
              <li>
                <Link href='/' className='hover:text-white transition-colors'>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href='/books'
                  className='hover:text-white transition-colors'>
                  All Books Catalog
                </Link>
              </li>
              <li>
                <Link
                  href='/add-book'
                  className='hover:text-white transition-colors'>
                  Add a Book
                </Link>
              </li>
              <li>
                <Link
                  href='/my-borrowed-books'
                  className='hover:text-white transition-colors'>
                  My Borrowed Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className='space-y-3'>
            <h3 className='text-xs font-bold text-white tracking-wider uppercase'>
              CONTACT US
            </h3>
            <ul className='space-y-2.5 text-xs text-slate-400'>
              <li className='flex items-center gap-2.5'>
                <svg
                  className='w-4 h-4 text-slate-400 shrink-0'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth='2'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
                <span>104 Literary Way, Booktown</span>
              </li>
              <li className='flex items-center gap-2.5'>
                <svg
                  className='w-4 h-4 text-slate-400 shrink-0'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth='2'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                  />
                </svg>
                <span>+1 (555) 234-BOOK</span>
              </li>
              <li className='flex items-center gap-2.5'>
                <svg
                  className='w-4 h-4 text-slate-400 shrink-0'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth='2'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
                <a
                  href='mailto:support@booknook.com'
                  className='hover:text-white transition-colors'>
                  support@booknook.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className='space-y-3'>
            <h3 className='text-xs font-bold text-white tracking-wider uppercase'>
              STAY CONNECTED
            </h3>
            <p className='text-xs text-slate-400 leading-relaxed'>
              Join our community newsletter for weekly reading picks.
            </p>
            <form className='flex items-center gap-2 pt-1'>
              <input
                type='email'
                placeholder='Enter email...'
                className='w-full bg-[#0b1021] border border-slate-800 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors'
              />
              <button
                type='submit'
                className='bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-medium px-4 py-2 rounded-md transition-colors shrink-0'>
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar Divider */}
        <div className='border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4'>
          <p>© 2026 BookNook Online Library. All rights reserved.</p>
          <div className='flex items-center gap-6'>
            <Link
              href='/privacy'
              className='hover:text-slate-400 transition-colors'>
              Privacy Policy
            </Link>
            <Link
              href='/terms'
              className='hover:text-slate-400 transition-colors'>
              Terms of Service
            </Link>
            <Link
              href='/rules'
              className='hover:text-slate-400 transition-colors'>
              Borrowing Rules
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

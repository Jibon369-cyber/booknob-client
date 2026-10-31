"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  BookMarked,
  CirclePlus,
  LogIn,
  Menu,
  Moon,
  Sun,
  UserPlus,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "cn";

type NavItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
  { label: "Add Book", href: "/add", icon: CirclePlus },
  { label: "My Books", href: "/my-books", icon: Bookmark },
  { label: "My Borrows", href: "/my-borrows", icon: BookMarked },
];

function isActivePath(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <header className='relative z-50 bg-[#1a2333]'>
      <div className='mx-auto flex h-[104px] max-w-7xl items-center gap-4 px-5 sm:px-6 xl:px-8'>
        <div className='flex flex-1 items-center'>
          <Link
            href='/'
            aria-label='BookNook home'
            className='flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c5ce7] sm:gap-6'>
            <Image
              src='/booknook-logo.png'
              alt=''
              width={56}
              height={56}
              priority
              unoptimized
              className='size-14 shrink-0 rounded-2xl'
            />
            <span className='flex flex-col'>
              <span className='text-[22px] font-extrabold leading-none tracking-tight text-white sm:text-[38px]'>
                Book<span className='text-[#f3d36a]'>Nook</span>
              </span>
              <span className='mt-1.5 hidden text-[10px] font-semibold uppercase leading-none tracking-[0.3em] text-[#8e9bb1] sm:block'>
                Online Library
              </span>
            </span>
          </Link>
        </div>

        <nav
          aria-label='Main'
          className='hidden items-center gap-1 rounded-full bg-[#222d40] p-1 ring-1 ring-white/[0.04] lg:flex'>
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2.5 text-base font-medium transition-colors",
                  active
                    ? "bg-[#5145e6] px-7 text-white shadow-[0_6px_18px_rgba(81,69,230,0.35)]"
                    : "text-[#c9d2e0] hover:bg-white/[0.05] hover:text-white",
                )}>
                {Icon ? (
                  <Icon
                    className='size-[18px]'
                    strokeWidth={2}
                    aria-hidden='true'
                  />
                ) : null}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className='flex flex-1 items-center justify-end gap-2.5'>
          <button
            type='button'
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#242f43] text-[#f6c945] ring-1 ring-white/[0.04] transition-colors hover:bg-[#2c3950] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c5ce7]'>
            {isDark ? (
              <Sun className='size-[18px]' aria-hidden='true' />
            ) : (
              <Moon className='size-[18px]' aria-hidden='true' />
            )}
          </button>

          <Link
            href='/login'
            className='hidden items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-[#e9eef6] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c5ce7] md:flex'>
            <LogIn className='size-[18px]' aria-hidden='true' />
            Login
          </Link>

          <Link
            href='/register'
            className='hidden items-center gap-2 rounded-xl bg-[#5b4cf5] px-4 py-3 text-base font-semibold text-white shadow-[0_0_22px_rgba(91,76,245,0.45)] transition-colors hover:bg-[#6a5df7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b7cff] sm:flex sm:px-5'>
            <UserPlus className='size-[18px]' aria-hidden='true' />
            Register
          </Link>

          <button
            type='button'
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#242f43] text-[#e9eef6] ring-1 ring-white/[0.04] transition-colors hover:bg-[#2c3950] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c5ce7] lg:hidden'>
            {mobileOpen ? (
              <X className='size-[18px]' aria-hidden='true' />
            ) : (
              <Menu className='size-[18px]' aria-hidden='true' />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className='absolute inset-x-0 top-full border-t border-white/[0.06] bg-[#1a2333] px-4 pb-4 pt-3 shadow-2xl lg:hidden'>
          <nav
            aria-label='Mobile'
            className='mx-auto flex max-w-[1600px] flex-col gap-1'>
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors",
                    active
                      ? "bg-[#5145e6] text-white"
                      : "text-[#c9d2e0] hover:bg-white/[0.05] hover:text-white",
                  )}>
                  {Icon ? (
                    <Icon
                      className='size-[18px]'
                      strokeWidth={2}
                      aria-hidden='true'
                    />
                  ) : null}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className='mx-auto mt-3 flex max-w-[1600px] items-center gap-2 md:hidden'>
            <Link
              href='/login'
              onClick={() => setMobileOpen(false)}
              className='flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-[15px] font-medium text-[#e9eef6] ring-1 ring-white/10 transition-colors hover:bg-white/[0.05] hover:text-white'>
              <LogIn className='size-[18px]' aria-hidden='true' />
              Login
            </Link>
            <Link
              href='/register'
              onClick={() => setMobileOpen(false)}
              className='flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#5b4cf5] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_0_22px_rgba(91,76,245,0.45)] transition-colors hover:bg-[#6a5df7] sm:hidden'>
              <UserPlus className='size-[18px]' aria-hidden='true' />
              Register
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

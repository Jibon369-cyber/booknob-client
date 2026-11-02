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

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "cn";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";

type NavItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/all-books" },
  { label: "Add Book", href: "/add-book", icon: CirclePlus },
  { label: "My Books", href: "/my-books", icon: Bookmark },
  { label: "My Borrows", href: "/my-borrows", icon: BookMarked },
];

function getAvatarSrc(url?: string | null) {
  if (!url) return undefined;
  if (url.includes("bing.com/images/search")) {
    try {
      const mediaUrl = new URL(url).searchParams.get("mediaurl");
      if (mediaUrl) return decodeURIComponent(mediaUrl);
    } catch {
      return url;
    }
  }
  return url;
}

function isActivePath(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const pathname = usePathname();

  const [isDark, setIsDark] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    authClient.signOut();
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b border-white/[0.07] bg-[#151e2e]/95 shadow-[0_4px_25px_rgba(0,0,0,0.12)] backdrop-blur-xl'>
      <div className='mx-auto flex h-[82px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 xl:px-8'>
        {/* Logo */}
        <Link
          href='/'
          aria-label='BookNook home'
          className='group flex shrink-0 items-center gap-3'>
          <Image
            src='/booknook-logo.png'
            alt='BookNook'
            width={48}
            height={48}
            priority
            className='size-12 rounded-xl object-cover transition-transform duration-300 group-hover:scale-105'
          />

          <div className='flex flex-col'>
            <span className='text-[25px] font-extrabold leading-none tracking-tight text-white'>
              Book<span className='text-[#f3d36a]'>Nook</span>
            </span>

            <span className='mt-1.5 text-[9px] font-semibold uppercase tracking-[0.28em] text-slate-400'>
              Your Digital Library
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label='Main navigation'
          className='hidden items-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.035] p-1.5 lg:flex'>
          {navItems
            .filter(
              (item) => user || item.href === "/" || item.href === "/all-books",
            )
            .map((item) => {
              const active = isActivePath(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-all duration-300",
                    active
                      ? "bg-[#5b4cf5] text-white shadow-[0_4px_15px_rgba(91,76,245,0.3)]"
                      : "text-slate-300 hover:bg-white/[0.07] hover:text-white",
                  )}>
                  {Icon && (
                    <Icon size={16} strokeWidth={2} aria-hidden='true' />
                  )}

                  {item.label}
                </Link>
              );
            })}
        </nav>

        {/* Right Actions */}
        <div className='flex shrink-0 items-center gap-2'>
          {/* Theme Toggle */}
          <button
            type='button'
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className='flex size-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-[#f3d36a] transition-all duration-300 hover:bg-white/[0.1] hover:rotate-12'>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <Popover>
              <PopoverTrigger
                nativeButton={false}
                render={
                  <Avatar
                    key={getAvatarSrc(user?.image) ?? user?.email ?? "guest"}>
                    <AvatarImage
                      referrerPolicy='no-referrer'
                      src={getAvatarSrc(user?.image)}
                      alt={user?.name ?? "User"}
                    />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                }></PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>{user?.name}</PopoverTitle>
                  <PopoverDescription>{user?.email}</PopoverDescription>
                </PopoverHeader>
                <Button onClick={handleLogout} className='bg-[#5b4cf5] hover:bg-[#6a5df7] text-white'>
                  Log Out
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Link
                href='/login'
                className='hidden items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-slate-300 transition-all duration-300 hover:bg-white/[0.07] hover:text-white md:flex'>
                <LogIn size={17} />
                Login
              </Link>

              <Link
                href='/register'
                className='hidden items-center gap-2 rounded-xl bg-[#5b4cf5] px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_4px_15px_rgba(91,76,245,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#6a5df7] hover:shadow-[0_6px_20px_rgba(91,76,245,0.4)] sm:flex'>
                <UserPlus size={17} />
                Register
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            type='button'
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls='mobile-navigation'
            className='flex size-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-white transition-all duration-300 hover:bg-white/[0.1] lg:hidden'>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        id='mobile-navigation'
        className={cn(
          "absolute inset-x-0 top-full overflow-hidden border-b border-white/[0.07] bg-[#151e2e]/[0.98] shadow-2xl backdrop-blur-xl transition-all duration-300 lg:hidden",
          mobileOpen
            ? "visible max-h-[500px] opacity-100"
            : "invisible max-h-0 opacity-0",
        )}>
        <div className='mx-auto max-w-7xl px-5 pb-5 pt-3 sm:px-6'>
          <nav aria-label='Mobile navigation' className='flex flex-col gap-1.5'>
            {navItems
              .filter(
                (item) =>
                  user || item.href === "/" || item.href === "/all-books",
              )
              .map((item) => {
                const active = isActivePath(pathname, item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                      active
                        ? "bg-[#5b4cf5] text-white shadow-md"
                        : "text-slate-300 hover:bg-white/[0.07] hover:text-white",
                    )}>
                    {Icon && <Icon size={18} />}
                    {item.label}
                  </Link>
                );
              })}
          </nav>

          {/* Mobile Authentication */}
          <div className='mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-4'>
            {!user && (
              <>
                <Link
                  href='/login'
                  className='flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/[0.07]'>
                  <LogIn size={17} />
                  Login
                </Link>

                <Link
                  href='/register'
                  className='flex items-center justify-center gap-2 rounded-xl bg-[#5b4cf5] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6a5df7]'>
                  <UserPlus size={17} />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

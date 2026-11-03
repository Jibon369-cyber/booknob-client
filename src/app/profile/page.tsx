"use client";



import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, User, ShieldCheck, Calendar, ArrowLeft } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


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

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="h-40 animate-pulse rounded-3xl bg-white/[0.04]" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <Card className="border-white/10 bg-white/80 dark:bg-[#151e2e]/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Sign in to view your profile</CardTitle>
              <CardDescription className="text-gray-500 dark:text-slate-400">
                You need an account to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-3">
              <Button render={<Link href="/login" />} className="bg-[#5b4cf5] hover:bg-[#6a5df7] text-gray-900 dark:text-white">
                Sign in
              </Button>
              <Button render={<Link href="/register" />} variant="outline" className="border-white/10 text-gray-900 dark:text-white hover:bg-white/5">
                Create account
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const initials = (user.name ?? user.email ?? "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const createdAt = (user as any)?.createdAt
    ? new Date((user as any).createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="flex-1 bg-background">
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5b4cf5]/20 via-[#151e2e] to-[#0b1220]" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#5b4cf5]/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#f3d36a]/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 py-12 sm:py-16">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-slate-300 transition-colors hover:text-gray-900 dark:text-white">
            <ArrowLeft size={16} />
            Back home
          </Link>

          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#5b4cf5] to-[#f3d36a] blur-md opacity-60" />
              <Avatar className="relative size-28 border-4 border-white/10 shadow-2xl">
                <AvatarImage
                  referrerPolicy="no-referrer"
                  src={getAvatarSrc(user.image)}
                  alt={user.name ?? "User"}
                />
                <AvatarFallback className="bg-[#5b4cf5] text-2xl font-bold text-gray-900 dark:text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  {user.name ?? "Reader"}
                </h1>
                <Badge className="bg-[#5b4cf5]/20 text-[#a9a2ff] border border-[#5b4cf5]/30 hover:bg-[#5b4cf5]/30">
                  <ShieldCheck size={12} className="mr-1" />
                  Member
                </Badge>
              </div>
              <p className="mt-2 text-gray-600 dark:text-slate-300">
                Welcome back to your BookNook library.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="border-white/10 bg-white/80 dark:bg-[#151e2e]/80 backdrop-blur-xl transition-all hover:border-[#5b4cf5]/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <User size={18} className="text-[#f3d36a]" />
                Account details
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-slate-400">
                Your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 text-gray-500 dark:text-slate-400" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-slate-500">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                </div>
              </div>
              {createdAt && (
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="mt-0.5 text-gray-500 dark:text-slate-400" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-slate-500">Member since</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{createdAt}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/80 dark:bg-[#151e2e]/80 backdrop-blur-xl transition-all hover:border-[#5b4cf5]/40">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Quick actions</CardTitle>
              <CardDescription className="text-gray-500 dark:text-slate-400">
                Jump back into your library
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button render={<Link href="/my-books" />} variant="outline" className="justify-start border-white/10 text-gray-900 dark:text-white hover:bg-white/5">
                My Books
              </Button>
              <Button render={<Link href="/my-borrows" />} variant="outline" className="justify-start border-white/10 text-gray-900 dark:text-white hover:bg-white/5">
                My Borrows
              </Button>
              <Button render={<Link href="/add-book" />} variant="outline" className="justify-start border-white/10 text-gray-900 dark:text-white hover:bg-white/5">
                Add a Book
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => authClient.signOut()}
            className="bg-[#5b4cf5] hover:bg-[#6a5df7] text-gray-900 dark:text-white shadow-[0_4px_15px_rgba(91,76,245,0.3)]">
            Sign out
          </Button>
        </div>
      </section>
    </main>
  );
}
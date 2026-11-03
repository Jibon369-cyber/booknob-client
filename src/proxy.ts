import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const result = await auth.api.getSession({
    headers: await headers(),
  });

  const user = result?.user;
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/my-books",
    "/my-borrows",
    "/add-book",
    "/profile",
    "/all-books/:path",
  ],
};

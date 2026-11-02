import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-2 text-slate-500">Page not found</p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl"
      >
        Back to Home
      </Link>
    </main>
  );
}

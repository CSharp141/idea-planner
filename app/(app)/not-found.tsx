import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="mb-2 text-6xl font-bold text-zinc-200 dark:text-zinc-700">404</p>
      <h1 className="mb-4 text-lg font-semibold text-zinc-800 dark:text-zinc-100">Page not found</h1>
      <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        Back to dashboard
      </Link>
    </div>
  );
}

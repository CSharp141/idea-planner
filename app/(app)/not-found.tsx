import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="mb-2 text-6xl font-display font-bold text-ink-200 dark:text-ink-700">404</p>
      <h1 className="mb-2 text-lg font-semibold text-ink-800 dark:text-ink-100">This page never made it off the ground</h1>
      <p className="mb-6 max-w-sm text-sm text-ink-500 dark:text-ink-400">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/dashboard" className="text-sm text-signal-600 hover:underline dark:text-signal-400">
        Back to dashboard
      </Link>
    </div>
  );
}

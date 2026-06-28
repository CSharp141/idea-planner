"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ink-950/80 backdrop-blur-md border-b border-white/10"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo href="/" wordmarkClassName="text-white" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          <a
            href="#features"
            className="text-sm font-medium text-ink-400 hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-ink-400 hover:text-white transition-colors"
          >
            Pricing
          </a>
          <Link
            href="/login"
            className="bg-signal-500 hover:bg-signal-400 text-ink-950 text-sm font-medium px-4 py-2 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-signal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
          >
            Start for Free
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-1"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden bg-ink-950/95 backdrop-blur-md border-t border-white/10 px-4 py-6 flex flex-col gap-6"
        >
          <a
            href="#features"
            onClick={closeMenu}
            className="text-sm font-medium text-ink-400 hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={closeMenu}
            className="text-sm font-medium text-ink-400 hover:text-white transition-colors"
          >
            Pricing
          </a>
          <Link
            href="/login"
            onClick={closeMenu}
            className="w-fit bg-signal-500 hover:bg-signal-400 text-ink-950 text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            Start for Free
          </Link>
        </nav>
      )}
    </header>
  );
}

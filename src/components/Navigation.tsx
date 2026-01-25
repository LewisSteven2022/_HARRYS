'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-gray-900/50">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Harry's Logo"
              width={48}
              height={48}
              className="h-12 w-auto"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <Link
              href="/training"
              className="nav-link text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase">
              Training
            </Link>
            <Link
              href="/timetable"
              className="nav-link text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase">
              Schedule
            </Link>
            <Link
              href="/results"
              className="nav-link text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase">
              Results
            </Link>
            <Link
              href="/coach"
              className="nav-link text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase">
              Coach
            </Link>
            <Link
              href="/contact"
              className="nav-link text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase">
              Contact
            </Link>
          </div>

          <div className="hidden lg:block">
            <Link
              href="/book-consultation"
              className="btn-lime text-xs font-semibold tracking-widest uppercase">
              Get Fit Now
            </Link>
          </div>

          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2">
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-white transition-all hamburger-line-1 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all hamburger-line-2 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all hamburger-line-3 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden absolute top-20 left-0 right-0 bg-[#0a0a0a] border-t border-gray-900">
            <div className="container mx-auto px-6 py-8 space-y-6">
              <Link
                href="/training"
                className="block text-sm font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
                onClick={() => setMobileMenuOpen(false)}>
                Training
              </Link>
              <Link
                href="/timetable"
                className="block text-sm font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
                onClick={() => setMobileMenuOpen(false)}>
                Schedule
              </Link>
              <Link
                href="/results"
                className="block text-sm font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
                onClick={() => setMobileMenuOpen(false)}>
                Results
              </Link>
              <Link
                href="/coach"
                className="block text-sm font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
                onClick={() => setMobileMenuOpen(false)}>
                Coach
              </Link>
              <Link
                href="/contact"
                className="block text-sm font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
                onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              <Link
                href="/book-consultation"
                className="inline-block btn-lime text-sm font-semibold tracking-widest uppercase mt-4"
                onClick={() => setMobileMenuOpen(false)}>
                Get Fit Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

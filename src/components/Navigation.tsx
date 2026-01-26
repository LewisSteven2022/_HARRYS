'use client'

import { useState } from 'react'
import Link from 'next/link'
import BasketIcon from './BasketIcon'
import BasketDrawer from './BasketDrawer'
import CreditIndicator from './CreditIndicator'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [basketOpen, setBasketOpen] = useState(false)

  return (
    <>
      <nav
        id="navbar"
        className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-gray-900/50"
      >
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/logo.png" alt="Harry's JSY" className="h-10 w-auto" />
            </Link>

            <div className="hidden lg:flex items-center gap-10">
              <Link
                href="/training"
                className="nav-link text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
              >
                Classes
              </Link>
              <Link
                href="/timetable"
                className="nav-link text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
              >
                Schedule
              </Link>
              <Link
                href="/results"
                className="nav-link text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
              >
                Testimonials
              </Link>
              <Link
                href="/coach"
                className="nav-link text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
              >
                Meet Harry
              </Link>
              <Link
                href="/contact"
                className="nav-link text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
              >
                Contact
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <CreditIndicator />
              <Link
                href="/account"
                className="text-xs font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
              >
                Account
              </Link>
              <BasketIcon onClick={() => setBasketOpen(true)} />
              <Link
                href="/timetable"
                className="btn-lime text-xs font-semibold tracking-widest uppercase"
              >
                Join the Pack
              </Link>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <BasketIcon onClick={() => setBasketOpen(true)} />
              <button
                id="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2"
              >
                <div className="space-y-1.5">
                  <span
                    className={`block w-6 h-0.5 bg-white transition-all hamburger-line-1 ${
                      mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                    }`}
                  ></span>
                  <span
                    className={`block w-6 h-0.5 bg-white transition-all hamburger-line-2 ${
                      mobileMenuOpen ? 'opacity-0' : ''
                    }`}
                  ></span>
                  <span
                    className={`block w-6 h-0.5 bg-white transition-all hamburger-line-3 ${
                      mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div
              id="mobile-menu"
              className="lg:hidden absolute top-20 left-0 right-0 bg-[#0a0a0a] border-t border-gray-900"
            >
              <div className="container mx-auto px-6 py-8 space-y-6">
                <Link
                  href="/training"
                  className="block text-sm font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Classes
                </Link>
                <Link
                  href="/timetable"
                  className="block text-sm font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Schedule
                </Link>
                <Link
                  href="/results"
                  className="block text-sm font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </Link>
                <Link
                  href="/coach"
                  className="block text-sm font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Meet Harry
                </Link>
                <Link
                  href="/contact"
                  className="block text-sm font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/account"
                  className="block text-sm font-medium tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account
                </Link>
                <Link
                  href="/timetable"
                  className="inline-block btn-lime text-sm font-semibold tracking-widest uppercase mt-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join the Pack
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <BasketDrawer isOpen={basketOpen} onClose={() => setBasketOpen(false)} />
    </>
  )
}

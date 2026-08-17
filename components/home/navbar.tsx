'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession() || {};

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="relative z-10 self-stretch shrink-0 w-24">
          <img
            src="/tanxusa-logo.svg"
            alt="TanXUSA logo"
            className="absolute left-0 top-0 h-32 w-auto max-w-none object-contain"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">Services</a>
          <a href="#deliveries" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">Recent Work</a>
          <a href="#why" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">Why TanXUSA</a>
          <a href="https://genzic.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">Genzic.AI</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={session ? '/dashboard' : '/login'}
            className="px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs sm:text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md shadow-emerald-500/20"
          >
            {session ? 'Dashboard' : 'Client Login'}
          </Link>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <a href="#services" onClick={() => setIsOpen(false)} className="text-sm text-gray-600">Services</a>
              <a href="#deliveries" onClick={() => setIsOpen(false)} className="text-sm text-gray-600">Recent Work</a>
              <a href="#why" onClick={() => setIsOpen(false)} className="text-sm text-gray-600">Why TanXUSA</a>
              <a href="https://genzic.ai" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="text-sm text-gray-600">Genzic.AI</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

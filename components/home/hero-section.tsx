'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background image with parallax */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Futuristic technology connections background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-gray-900/80" />
      </div>

      {/* Floating circuit pattern overlay */}
      <div className="absolute inset-0 z-[1]">
        <svg className="absolute top-20 left-10 w-64 h-64 text-emerald-500/10" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="2" fill="currentColor" />
          <circle cx="50" cy="50" r="1.5" fill="currentColor" />
          <circle cx="150" cy="50" r="1.5" fill="currentColor" />
          <circle cx="50" cy="150" r="1.5" fill="currentColor" />
          <circle cx="150" cy="150" r="1.5" fill="currentColor" />
          <line x1="50" y1="50" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
          <line x1="150" y1="50" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="150" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
          <line x1="150" y1="150" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-400/30 backdrop-blur-sm mb-8">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">Powered by Genzic.AI Strategy</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
        >
          Execution at{' '}
          <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">10X Speed</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          We turn strategy into reality. AI agents + expert delivery team that builds,
          automates, and scales operations for growing businesses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#deliveries"
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-base hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
          >
            See Our Work
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            href="/login"
            className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold text-base hover:border-emerald-400 hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            Client Login
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex items-center justify-center gap-8 text-sm text-gray-300"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Agents Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>24/7 Operations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-Time Tracking</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

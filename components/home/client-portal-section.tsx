'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { BarChart3, Calendar, Bot, FolderOpen, MessageCircle, Shield } from 'lucide-react';

const features = [
  { icon: BarChart3, label: 'Active Projects', desc: 'Track progress in real-time' },
  { icon: Calendar, label: 'Milestones', desc: 'See what\'s coming next' },
  { icon: Bot, label: 'AI Agent Activity', desc: 'Monitor autonomous operations' },
  { icon: FolderOpen, label: 'File Access', desc: 'All deliverables in one place' },
  { icon: MessageCircle, label: 'Live Chat', desc: 'Direct line to your team' },
  { icon: Shield, label: 'Full Transparency', desc: 'Nothing hidden, ever' },
];

export function ClientPortalSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 bg-white" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-emerald-500/10">
              <div className="relative aspect-video bg-gray-100">
                <Image
                  src="https://cdn.abacus.ai/images/62c07644-aff0-414e-ac95-2db901b37c0d.png"
                  alt="TanXUSA Client Dashboard showing project progress, milestones, and AI agent activity"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl px-4 py-3 shadow-lg border border-gray-100 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-semibold text-gray-800">Live Dashboard</span>
            </div>
          </motion.div>

          {/* Right side - Features */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-4">Client Portal</span>
            <h2 className="font-display text-4xl font-bold tracking-tight text-gray-900 mb-4">Your Command Center</h2>
            <p className="text-gray-600 text-lg mb-8">Full visibility into every project, milestone, and AI agent working for you. No surprises — just results.</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((f: any, i: number) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{f.label}</div>
                    <div className="text-xs text-gray-500">{f.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all shadow-lg shadow-emerald-500/20"
            >
              Access Your Portal
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

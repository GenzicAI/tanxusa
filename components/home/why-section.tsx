'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Rocket, Eye, Fingerprint, Handshake } from 'lucide-react';

const reasons = [
  {
    icon: Rocket,
    title: 'Blazing Fast Delivery',
    description: 'AI-augmented workflows mean we deliver in days, not months. Your projects move at startup speed.',
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    icon: Eye,
    title: 'Full Transparency via Client Portal',
    description: 'Real-time progress, milestone tracking, and live chat. You see everything as it happens.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Fingerprint,
    title: 'Truly Custom Solutions',
    description: 'No templates. No shortcuts. Every solution is built from scratch to fit your exact needs.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Handshake,
    title: 'Seamless Partner to Genzic.AI',
    description: 'Strategy from Genzic.AI flows directly into execution at TanXUSA. One pipeline, zero friction.',
    gradient: 'from-amber-500 to-orange-500',
  },
];

export function WhySection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="why" className="py-24 bg-white" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-4">Why TanXUSA</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">The Execution Advantage</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">We don't just plan — we build. Here's why businesses trust us with their most critical projects.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason: any, index: number) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                <reason.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">{reason.title}</h3>
              <p className="text-gray-600 leading-relaxed">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

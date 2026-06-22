'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { CheckCircle, TrendingUp, Zap } from 'lucide-react';

const deliveries = [
  {
    title: "Lisa's Efficient Website",
    description: 'A high-converting business website built from scratch with custom design, SEO optimization, and integrated lead capture system.',
    image: 'https://cdn.abacus.ai/images/0db69897-1677-4c97-b359-7770ed7a4085.png',
    metrics: [
      { label: 'Load Time', value: '0.8s' },
      { label: 'Conversion Rate', value: '+340%' },
      { label: 'SEO Score', value: '98/100' },
    ],
    tags: ['Custom Website', 'SEO', 'Lead Gen'],
  },
  {
    title: "Grayson's 3D Prints E-commerce",
    description: 'Full e-commerce platform for 3D printed electric bike parts with custom configurator, real-time pricing, and automated order fulfillment.',
    image: 'https://cdn.abacus.ai/images/46a187b2-e495-4e6d-bd94-c008655541cd.png',
    metrics: [
      { label: 'Products', value: '150+' },
      { label: 'Order Automation', value: '100%' },
      { label: 'Revenue Growth', value: '+520%' },
    ],
    tags: ['E-commerce', '3D Printing', 'Automation'],
  },
  {
    title: 'Genzic Executor Internal Tool',
    description: 'Custom project management and execution tracking platform powering TanXUSA\'s internal operations with AI-driven task allocation.',
    image: 'https://cdn.abacus.ai/images/20252650-6e91-4d8e-a72d-bd98ff50f3e1.png',
    metrics: [
      { label: 'Efficiency', value: '+280%' },
      { label: 'Tasks Automated', value: '85%' },
      { label: 'Team Velocity', value: '10X' },
    ],
    tags: ['Internal Tool', 'AI Automation', 'Project Mgmt'],
  },
];

export function DeliveriesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="deliveries" className="py-24 bg-gray-50/50" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-4">Recent Deliveries</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">Built. Shipped. Scaled.</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Real results from real projects. Every delivery comes with measurable outcomes.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {deliveries.map((project: any, index: number) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <Image
                  src={project.image}
                  alt={`${project.title} project preview`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {(project.tags ?? []).map((tag: string) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600">{tag}</span>
                  ))}
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">{project.description}</p>
                <div className="grid grid-cols-3 gap-3">
                  {(project.metrics ?? []).map((metric: any) => (
                    <div key={metric.label} className="text-center p-3 rounded-lg bg-gray-50">
                      <div className="text-lg font-bold text-emerald-600">{metric.value}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

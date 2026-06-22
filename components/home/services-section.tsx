'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Bot, Workflow, Mic, Globe, LayoutDashboard, Clock } from 'lucide-react';

const services = [
  {
    icon: Bot,
    title: 'AI Agent Workforces',
    description: 'Deploy autonomous AI agents that handle research, outreach, data processing, and customer support around the clock.',
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Workflow,
    title: 'Custom Automations & Workflows',
    description: 'End-to-end workflow automation that eliminates repetitive tasks and connects your entire tech stack.',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Mic,
    title: 'Voice Commerce Platforms',
    description: 'AI-powered voice interfaces for ordering, customer service, and hands-free commerce experiences.',
    color: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    icon: Globe,
    title: 'Custom Websites & E-commerce',
    description: 'Built from scratch, no templates. High-performance sites designed for conversion and scale.',
    color: 'from-cyan-500 to-cyan-600',
    bg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
  {
    icon: LayoutDashboard,
    title: 'Project Delivery Command Centers',
    description: 'Real-time dashboards with milestone tracking, AI agent monitoring, and full transparency.',
    color: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: Clock,
    title: '24/7 Autonomous Operations',
    description: 'Your AI workforce never sleeps. Continuous monitoring, optimization, and execution.',
    color: 'from-rose-500 to-rose-600',
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
];

export function ServicesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="services" className="py-24 bg-gray-50/50" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-4">What We Deliver</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">Full-Stack Execution</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">From AI agent deployment to custom platforms — we build, automate, and operate everything your business needs.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any, index: number) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white rounded-xl p-7 border border-gray-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center mb-5`}>
                <service.icon className={`w-6 h-6 ${service.iconColor}`} />
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-xl bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

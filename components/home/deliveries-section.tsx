'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { PlayCircle, ExternalLink } from 'lucide-react';
import { galleryCategories, galleryProjects, screenshotUrl, type GalleryCategory, type GalleryProject } from './gallery-data';
import { GalleryModal } from './gallery-modal';

export function DeliveriesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');
  const [activeProject, setActiveProject] = useState<GalleryProject | null>(null);

  const filteredProjects = useMemo(
    () =>
      activeCategory === 'All'
        ? galleryProjects
        : galleryProjects.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  return (
    <section id="deliveries" className="py-24 bg-gray-50/50" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-4">Live Execution Gallery</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">Built. Shipped. Scaled.</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Real, live projects — not mockups. Launch any build below and explore it exactly as our clients do.</p>
        </motion.div>

        {/* Filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-10 -mx-6 px-6 md:flex-wrap md:justify-center md:overflow-visible md:mx-0 md:px-0"
        >
          {galleryCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-900">
                <Image
                  src={project.image ?? screenshotUrl(project.url)}
                  alt={`${project.title} live preview screenshot`}
                  fill
                  loading="lazy"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => setActiveProject(project)}
                  aria-label={`Launch live preview of ${project.title}`}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors"
                >
                  <PlayCircle className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="inline-block w-fit px-2.5 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600 mb-3">{project.category}</span>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-1">{project.title}</h3>
                <p className="text-sm font-medium text-emerald-600 mb-4">{project.tagline}</p>
                <ul className="space-y-1.5 mb-6 flex-1">
                  {project.features.map((feature) => (
                    <li key={feature} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveProject(project)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Launch Live Preview
                  </button>
                  {!project.noNewTab && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.title} in a new tab`}
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <GalleryModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import type { GalleryProject } from './gallery-data';

const IFRAME_TIMEOUT_MS = 6000;

interface GalleryModalProps {
  project: GalleryProject | null;
  onClose: () => void;
}

export function GalleryModal({ project, onClose }: GalleryModalProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'blocked'>('loading');

  useEffect(() => {
    if (!project) return;
    setStatus('loading');

    const timer = setTimeout(() => {
      setStatus((current) => (current === 'loading' ? 'blocked' : current));
    }, IFRAME_TIMEOUT_MS);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm sm:p-4 md:p-6"
      onClick={onClose}
    >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-gray-950 shadow-2xl md:h-[90vh] md:w-[92vw] md:rounded-2xl lg:h-[85vh] lg:max-w-[1200px]"
            style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-gray-900 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{project.title}</p>
                <p className="truncate text-xs text-gray-400">{project.url.replace(/^https?:\/\//, '')}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                {/* Closes the flyout as it expands. The iframe otherwise stays
                    mounted and keeps running, and for a build that narrates
                    itself the backgrounded copy talks over the new tab's own
                    walkthrough. */}
                {!project.noNewTab && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex h-11 items-center gap-1.5 rounded-lg bg-white/10 px-3 text-xs font-medium text-white hover:bg-white/20 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Open in New Tab</span>
                  </a>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close preview"
                  className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="relative flex-1 bg-white">
              {status !== 'loaded' && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-gray-950 text-center px-6">
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                      <p className="text-sm text-gray-300">Loading live preview…</p>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-8 w-8 text-amber-400" />
                      <p className="text-sm text-gray-300 max-w-xs">
                        {project.noNewTab
                          ? 'This preview didn’t load. Close this and launch it again.'
                          : 'This build resists embedded preview. Open it directly to explore the full experience.'}
                      </p>
                      {!project.noNewTab && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open in New Tab
                        </a>
                      )}
                    </>
                  )}
                </div>
              )}
              <iframe
                key={project.slug}
                src={project.url}
                title={`Live preview of ${project.title}`}
                className="h-full w-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                loading="lazy"
                onLoad={() => setStatus('loaded')}
              />
            </div>

            {/* Attribution */}
            <div className="flex items-center justify-center border-t border-white/10 bg-gray-900 px-4 py-2">
              <p className="text-[11px] font-medium tracking-wide text-gray-400">
                Live TanXUSA Build — Powered by <span className="text-emerald-400">Genzic.AI</span>
              </p>
            </div>
      </motion.div>
    </motion.div>
  );
}

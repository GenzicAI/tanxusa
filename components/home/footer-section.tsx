'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export function FooterSection() {
  const { data: session } = useSession() || {};

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.jpg" alt="TanXUSA logo" className="w-9 h-9 rounded-lg object-cover" />
              <img src="/wordmark.jpg" alt="TanXUSA" className="h-7 object-contain brightness-0 invert" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              The execution and delivery arm of Genzic.AI. We turn strategy into reality with AI agents and expert delivery teams.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#services" className="text-gray-300 hover:text-emerald-400 text-sm transition-colors">Services</a></li>
              <li><a href="#deliveries" className="text-gray-300 hover:text-emerald-400 text-sm transition-colors">Recent Work</a></li>
              <li><a href="#why" className="text-gray-300 hover:text-emerald-400 text-sm transition-colors">Why TanXUSA</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://genzic.ai" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-emerald-400 text-sm transition-colors">
                  Genzic.AI
                </a>
              </li>
              <li>
                <Link href={session ? '/dashboard' : '/login'} className="text-gray-300 hover:text-emerald-400 text-sm transition-colors">
                  Client Login
                </Link>
              </li>
              <li>
                <a href="mailto:contact@tanxusa.com" className="text-gray-300 hover:text-emerald-400 text-sm transition-colors">
                  contact@tanxusa.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2026 TanXUSA. All rights reserved.</p>
          <p className="text-gray-500 text-sm">Powered by <a href="https://genzic.ai" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">Genzic.AI</a></p>
        </div>
      </div>
    </footer>
  );
}

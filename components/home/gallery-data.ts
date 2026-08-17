export type GalleryCategory =
  | 'All'
  | 'Websites & E-com'
  | 'AI Agents & Platforms'
  | 'Internal Systems'
  | 'Voice & Concierge';

export interface GalleryProject {
  slug: string;
  title: string;
  category: Exclude<GalleryCategory, 'All'>;
  tagline: string;
  url: string;
  features: string[];
}

export const galleryCategories: GalleryCategory[] = [
  'All',
  'Websites & E-com',
  'AI Agents & Platforms',
  'Internal Systems',
  'Voice & Concierge',
];

export const galleryProjects: GalleryProject[] = [
  {
    slug: 'broke-racing',
    title: 'Broke Racing',
    category: 'Websites & E-com',
    tagline: 'E-commerce Website',
    url: 'https://broke-racing.vercel.app/',
    features: [
      'Full product catalog with model-specific filters',
      'Real-time cart & checkout',
      'Custom part configurator',
      'Apparel + parts dual shop',
    ],
  },
  {
    slug: 'ln-skin-studio',
    title: 'LN Skin Studio',
    category: 'Websites & E-com',
    tagline: 'Luxury Service Booking Site',
    url: 'https://ln-skin-studio.vercel.app/',
    features: [
      'Multi-language support',
      'AI auto-appointment with Calendly',
      'Live chat',
      'Quick 3-tap booking flow',
    ],
  },
  {
    slug: 'nichelead-ai',
    title: 'NicheLead AI',
    category: 'AI Agents & Platforms',
    tagline: 'AI Lead Generation Platform',
    url: 'https://nichelead-ai.vercel.app/',
    features: [
      'Industry selector dashboard',
      'Instant lead scoring',
      'One-click campaign launch',
      'Scalable niche templates',
    ],
  },
  {
    slug: 'resource-group-leads',
    title: 'Resource Group Lead Engine',
    category: 'AI Agents & Platforms',
    tagline: 'B2B Lead Generation Platform',
    url: 'https://resource-group-leads.vercel.app/',
    features: [
      'Business-line selector across 5 verticals',
      'Two-stage AI search: plain-English query to visible plan',
      'Transparent 100-pt lead scoring',
      'HIPAA-aware compliance gating built-in',
    ],
  },
  {
    slug: 'intel-forge',
    title: 'IntelForge',
    category: 'AI Agents & Platforms',
    tagline: 'AI Intelligence Platform',
    url: 'https://intel-forge-genzic-ai.vercel.app/',
    features: [
      'Daily automated briefings',
      'Live signal dashboard',
      'Sentiment & velocity tracking',
      'Email / Slack delivery',
    ],
  },
  {
    slug: 'intel-forge-login',
    title: 'IntelForge Client Portal',
    category: 'AI Agents & Platforms',
    tagline: 'Multi-Tenant Login & Onboarding',
    url: 'https://intel-forge-genzic-ai.vercel.app/login',
    features: [
      'Email + password sign-in',
      'Magic link sign-in',
      'Create account flow',
      'Multi-tenant dashboard access',
    ],
  },
  {
    slug: 'genzic-executor',
    title: 'Genzic Executor',
    category: 'Internal Systems',
    tagline: 'Internal Command Center',
    url: 'https://genzic-executor.vercel.app/',
    features: [
      'Natural-language dispatch',
      'Multi-agent routing (Max, Brittany, Brigitte)',
      'Real-time execution log',
      'Mobile-ready command input',
    ],
  },
  {
    slug: 'genzic-ai-agent',
    title: 'Genzic AI Agent',
    category: 'AI Agents & Platforms',
    tagline: 'Restaurant Intelligence Agent',
    url: 'https://genzic-ai-agent.vercel.app/',
    features: [
      'Voice-first queries',
      'Live Toast POS data',
      'Spoken answers',
      'Read-only secure access',
    ],
  },
  {
    slug: 'genzic-concierge-max',
    title: 'Genzic Concierge — Max',
    category: 'Voice & Concierge',
    tagline: 'AI Integration Onboarding',
    url: 'https://genzic-concierge.vercel.app/assistant?agent=max',
    features: [
      'Orb-activated voice intake',
      'Guided AI integration audit flow',
      'Listen → Speak → Send',
      'Instant session start',
    ],
  },
  {
    slug: 'genzic-concierge-brittany',
    title: 'Genzic Concierge — Brittany',
    category: 'Voice & Concierge',
    tagline: 'Website / App Build Onboarding',
    url: 'https://genzic-concierge.vercel.app/assistant?agent=brittany',
    features: [
      'Orb-activated voice intake',
      'Guided website/app build onboarding',
      'Listen → Speak → Send',
      'Instant session start',
    ],
  },
  {
    slug: 'voice-translator',
    title: 'Genzic Voice Translator',
    category: 'Voice & Concierge',
    tagline: 'EN ↔ VI Real-Time Voice Translation',
    url: 'https://voice-translator-bay.vercel.app/',
    features: [
      'Install-free, browser-only, works on any phone',
      'Live English ↔ Vietnamese speech translation',
      'App-controlled cloud voice for consistent audio',
      'Guided in-app tutorial, zero setup',
    ],
  },
];

export function screenshotUrl(url: string) {
  return `https://image.thum.io/get/width/900/crop/675/noanimate/${url}`;
}

import { useState } from 'react';
import { Globe, MoonStar } from 'lucide-react';
import type { LanguageCode } from '../data/storyData';

interface HeroLandingProps {
  language: LanguageCode;
  onToggleLanguage: () => void;
  onOpenPrologue: () => void;
}

const MOBILE_STARS = [
  { top: '4%', left: '12%', size: 'w-1.5 h-1.5', opacity: 'opacity-90' },
  { top: '8%', left: '28%', size: 'w-1 h-1', opacity: 'opacity-70' },
  { top: '5%', left: '46%', size: 'w-2 h-2', opacity: 'opacity-90' },
  { top: '7%', left: '66%', size: 'w-1 h-1', opacity: 'opacity-75' },
  { top: '4%', left: '84%', size: 'w-1.5 h-1.5', opacity: 'opacity-85' },
  { top: '13%', left: '18%', size: 'w-1 h-1', opacity: 'opacity-65' },
  { top: '12%', left: '38%', size: 'w-1 h-1', opacity: 'opacity-80' },
  { top: '14%', left: '57%', size: 'w-1.5 h-1.5', opacity: 'opacity-75' },
  { top: '11%', left: '76%', size: 'w-1 h-1', opacity: 'opacity-70' },
  { top: '16%', left: '90%', size: 'w-1 h-1', opacity: 'opacity-65' },
  { top: '18%', left: '8%', size: 'w-1 h-1', opacity: 'opacity-60' },
  { top: '19%', left: '31%', size: 'w-1.5 h-1.5', opacity: 'opacity-80' },
];

export function HeroLanding({
  language,
  onToggleLanguage,
  onOpenPrologue,
}: HeroLandingProps) {
  const [imageError, setImageError] = useState(false);

  const copy =
    language === 'en'
      ? {
          primaryCta: '🚀 Start the Adventure!',
          switchLabel: 'Español',
          imageAlt:
            'Anka Killapi landing artwork showing a Peruvian boy in a colorful chullo hat and poncho sitting on lunar rock looking up at the golden Anka Killapi title, a glowing full moon, and a perched eagle under a starry night sky',
        }
      : {
          primaryCta: '🚀 ¡Comenzar la aventura!',
          switchLabel: 'English',
          imageAlt:
            'Ilustración principal de Anka Killapi con un niño peruano usando chullo y poncho sobre rocas lunares mirando el título dorado Anka Killapi, la luna llena y un águila posada bajo un cielo estrellado',
        };

  return (
    <section
      id="top"
      className="relative w-full min-h-[100svh] bg-[radial-gradient(120%_70%_at_50%_100%,_#0a44ba_0%,_#041d66_45%,_#020b2c_85%)] flex flex-col justify-center md:justify-end overflow-hidden"
    >
      {/* Starry cosmic sky extension for portrait mobile screens */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[40svh] md:hidden"
      >
        {MOBILE_STARS.map((star, idx) => (
          <span
            key={idx}
            style={{ top: star.top, left: star.left }}
            className={`absolute rounded-full bg-sky-200 shadow-[0_0_10px_rgba(125,211,252,0.95)] ${star.size} ${star.opacity}`}
          />
        ))}
      </div>

      {!imageError ? (
        <div className="relative w-full pt-10 md:pt-0 md:absolute md:inset-0 flex items-center justify-center">
          <img
            src="/assets/aistudio/Landing_page_Anka_Killapi2_3bb17442.png"
            alt={copy.imageAlt}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-auto md:h-full object-contain md:object-cover object-center select-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_88%,transparent_100%)] md:[mask-image:none]"
          />
          {/* Bottom atmospheric blend on desktop */}
          <div
            aria-hidden="true"
            className="pointer-events-none hidden md:block absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#020b2c]/85 via-[#020b2c]/35 to-transparent"
          />
        </div>
      ) : (
        <div className="relative w-full flex-1 md:min-h-[100svh] flex flex-col items-center justify-center px-6 text-center">
          <MoonStar className="w-12 h-12 text-amber-300 mb-4" aria-hidden="true" />
          <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tight text-white">
            Anka Killapi
          </h1>
        </div>
      )}

      {/* CTA & Language Switcher */}
      <div className="relative z-10 w-full px-6 pt-6 pb-10 md:pt-0 md:pb-12 flex flex-col items-center gap-3.5">
        <button
          type="button"
          onClick={onOpenPrologue}
          className="inline-flex items-center justify-center gap-2.5 min-h-[54px] px-8 py-3.5 rounded-full bg-gradient-to-b from-[#ffd426] to-[#f59e0b] hover:from-[#ffe055] hover:to-[#fbbf24] text-[#05102e] text-base sm:text-lg font-bold whitespace-nowrap shrink-0 shadow-[0_8px_32px_rgba(245,158,11,0.42)] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#041d66]"
        >
          <span>{copy.primaryCta}</span>
        </button>

        <footer className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <a
            href="https://github.com/anka-killapi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 py-1.5 text-xs sm:text-sm font-normal text-slate-300/75 hover:text-slate-100 transition-colors duration-150 hover:underline underline-offset-4 decoration-slate-300/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/60 rounded"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3.5 h-3.5 shrink-0"
              aria-hidden="true"
            >
              <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            <span>View on GitHub</span>
          </a>

          <button
            type="button"
            onClick={onToggleLanguage}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 text-sm sm:text-base font-medium text-slate-100 hover:text-amber-300 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md"
          >
            <Globe className="w-4 h-4 text-sky-200/90" aria-hidden="true" />
            <span className="underline underline-offset-4 decoration-white/60 hover:decoration-amber-300">
              {copy.switchLabel}
            </span>
          </button>
        </footer>
      </div>
    </section>
  );
}

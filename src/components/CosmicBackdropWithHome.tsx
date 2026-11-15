import { useEffect, useRef, useState } from 'react';
import { Home } from 'lucide-react';
import type { LanguageCode } from '../data/storyData';

interface CosmicBackdropWithHomeProps {
  language: LanguageCode;
  onGoHome: () => void;
}

const BG_NATURAL_WIDTH = 1036;
const BG_NATURAL_HEIGHT = 1518;

// Pixel bounds of the Anka Killapi eagle + wordmark inside background4_66000adc.png
// (measured 40..259 x 33..122) with comfortable padding for touch & pointer clicks
const LOGO_BOX = {
  left: 26,
  top: 22,
  width: 248,
  height: 112,
};

export function CosmicBackdropWithHome({
  language,
  onGoHome,
}: CosmicBackdropWithHomeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [bgError, setBgError] = useState(false);
  const [logoRect, setLogoRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateLogoRect = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;

      // Matches CSS `object-cover object-left-top` on a 1036x1518 image
      const scale = Math.max(
        width / BG_NATURAL_WIDTH,
        height / BG_NATURAL_HEIGHT
      );

      setLogoRect({
        left: LOGO_BOX.left * scale,
        top: LOGO_BOX.top * scale,
        width: Math.max(44, LOGO_BOX.width * scale),
        height: Math.max(44, LOGO_BOX.height * scale),
      });
    };

    updateLogoRect();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateLogoRect);
      return () => window.removeEventListener('resize', updateLogoRect);
    }

    const observer = new ResizeObserver(updateLogoRect);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const copy =
    language === 'en'
      ? {
          bgAlt: 'Anka Killapi starry midnight blue cosmic background',
          homeLabel: 'Anka Killapi — Go to main page',
          fallbackTitle: 'Anka Killapi',
        }
      : {
          bgAlt: 'Fondo estrellado azul cósmico de Anka Killapi',
          homeLabel: 'Anka Killapi — Ir a la página principal',
          fallbackTitle: 'Anka Killapi',
        };

  return (
    <>
      {!bgError && (
        <div
          ref={containerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <img
            src="/assets/aistudio/background4_66000adc.png"
            alt={copy.bgAlt}
            referrerPolicy="no-referrer"
            onError={() => setBgError(true)}
            className="w-full h-full object-cover object-left-top select-none"
          />
          <div className="hidden md:block absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0855cf]/80 via-[#042b85]/25 to-transparent" />
        </div>
      )}

      {/* Clickable Top-Left Anka Killapi Icon -> Always Returns to Main Page */}
      {!bgError ? (
        <button
          type="button"
          onClick={onGoHome}
          aria-label={copy.homeLabel}
          title={copy.homeLabel}
          style={
            logoRect
              ? {
                  left: `${logoRect.left}px`,
                  top: `${logoRect.top}px`,
                  width: `${logoRect.width}px`,
                  height: `${logoRect.height}px`,
                }
              : undefined
          }
          className={`absolute z-30 rounded-2xl bg-transparent hover:bg-amber-300/10 hover:ring-2 hover:ring-amber-300/55 active:scale-[0.98] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
            logoRect ? '' : 'top-3 left-3 w-36 h-16 sm:top-5 sm:left-6 sm:w-56 sm:h-24'
          }`}
        />
      ) : (
        <button
          type="button"
          onClick={onGoHome}
          aria-label={copy.homeLabel}
          title={copy.homeLabel}
          className="absolute top-4 left-4 sm:top-6 sm:left-8 z-30 inline-flex items-center gap-2 min-h-[40px] px-3.5 py-2 rounded-full bg-[#020b2c]/75 hover:bg-[#051854]/90 border border-amber-300/40 text-amber-300 font-playful font-semibold text-sm shadow-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          <span>{copy.fallbackTitle}</span>
        </button>
      )}
    </>
  );
}

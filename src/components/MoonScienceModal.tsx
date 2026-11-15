import { useEffect } from 'react';
import type { LanguageCode } from '../data/storyData';

interface MoonScienceModalProps {
  open: boolean;
  language: LanguageCode;
  onClose: () => void;
}

const NASA_SCIENCE_IMAGE_URL =
  'https://www.nasa.gov/wp-content/uploads/static/history/ap11ann/kippsphotos/5942a.jpg';

export function MoonScienceModal({
  open,
  language,
  onClose,
}: MoonScienceModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const copy =
    language === 'en'
      ? {
          heading: '🌕 Bringing Science to the Moon! 🚀',
          description:
            'Apollo 11 astronaut Buzz Aldrin carries scientific experiments across the lunar surface for deployment—including the laser retroreflector and the moonquake seismometer.',
          credit: 'Image credit: NASA',
          closeLabel: 'Close modal',
          imageAlt:
            'NASA Apollo 11 photograph showing astronaut Buzz Aldrin carrying scientific experiments for deployment on the Moon',
        }
      : {
          heading: '🌕 ¡Llevando ciencia a la Luna! 🚀',
          description:
            'El astronauta del Apollo 11 Buzz Aldrin lleva experimentos científicos sobre la superficie lunar para instalarlos, entre ellos el retroreflector láser y el sismómetro lunar.',
          credit: 'Crédito de la imagen: NASA',
          closeLabel: 'Cerrar ventana',
          imageAlt:
            'Fotografía de la NASA del Apollo 11 mostrando al astronauta Buzz Aldrin llevando experimentos científicos para instalar en la Luna',
        };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="moon-science-modal-heading"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#01071a]/80 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[92svh] overflow-y-auto rounded-2xl bg-[#041033] border border-amber-300/35 shadow-[0_24px_80px_rgba(1,6,24,0.9)] p-5 sm:p-8 text-center"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={copy.closeLabel}
          className="absolute top-3.5 right-3.5 inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#07194d] hover:bg-[#0b256e] border border-amber-300/30 text-amber-200 hover:text-amber-100 text-lg font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          ✕
        </button>

        <h2
          id="moon-science-modal-heading"
          className="font-playful font-semibold text-2xl sm:text-3xl text-amber-300 pr-10 pl-10 mb-4 [text-wrap:balance]"
        >
          {copy.heading}
        </h2>

        <div className="flex flex-col items-center justify-center my-4">
          <img
            src={NASA_SCIENCE_IMAGE_URL}
            alt={copy.imageAlt}
            referrerPolicy="no-referrer"
            className="block w-auto h-auto max-w-full max-h-[55svh] mx-auto rounded-xl border border-amber-300/25 shadow-[0_12px_40px_rgba(0,0,0,0.45)] object-contain"
          />
          <p className="mt-2.5 text-xs text-amber-200/80 tracking-wide">
            {copy.credit}
          </p>
          <p className="mt-1 text-[11px] text-slate-400 break-all max-w-full px-2">
            {language === 'en' ? 'Source: ' : 'Fuente: '}
            <a
              href={NASA_SCIENCE_IMAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-amber-300 transition-colors"
            >
              {NASA_SCIENCE_IMAGE_URL}
            </a>
          </p>
        </div>

        <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-md mx-auto">
          {copy.description}
        </p>
      </div>
    </div>
  );
}

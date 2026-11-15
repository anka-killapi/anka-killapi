import { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import type { LanguageCode } from '../data/storyData';

interface LunarModuleBlueprintModalProps {
  open: boolean;
  language: LanguageCode;
  onClose: () => void;
}

const NASA_PDF_SOURCE_URL =
  'https://solarsystem.nasa.gov/system/downloadable_items/2920_Apollo_11.pdf';

export function LunarModuleBlueprintModal({
  open,
  language,
  onClose,
}: LunarModuleBlueprintModalProps) {
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
          heading: '📐 Apollo 11 Lunar Module Blueprint',
          subtitle: 'Original 1969 NASA Apollo 11 Press Kit · Page 101',
          credit: 'Document credit: NASA',
          closeLabel: 'Close blueprint modal',
          openPdf: 'Open Full NASA PDF (Page 101)',
          imageAlt:
            'Original NASA Apollo Lunar Module technical diagram from page 101 of the Apollo 11 Press Kit showing docking window, hatch, ladder, landing gear, and descent engine',
        }
      : {
          heading: '📐 Plano del Módulo Lunar Apollo 11',
          subtitle: 'Documento original de la NASA (1969) · Página 101',
          credit: 'Documento oficial: NASA',
          closeLabel: 'Cerrar plano',
          openPdf: 'Abrir PDF completo de la NASA (Pág. 101)',
          imageAlt:
            'Diagrama técnico original de la NASA del Módulo Lunar Apollo 11 en la página 101 mostrando la ventana, escotilla, escalera, tren de aterrizaje y motor de descenso',
        };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="blueprint-modal-heading"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#01071a]/80 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92svh] overflow-y-auto rounded-2xl bg-[#041033] border border-amber-300/35 shadow-[0_24px_80px_rgba(1,6,24,0.9)] p-5 sm:p-8 text-center"
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
          id="blueprint-modal-heading"
          className="font-playful font-semibold text-2xl sm:text-3xl text-amber-300 pr-10 pl-10 mb-1.5 [text-wrap:balance]"
        >
          {copy.heading}
        </h2>
        <p className="text-xs sm:text-sm text-sky-200/85 mb-4">
          {copy.subtitle}
        </p>

        <div className="flex flex-col items-center justify-center my-3">
          <div className="bg-white rounded-xl p-1.5 sm:p-2 border border-amber-300/30 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
            <img
              src="/assets/aistudio/apollo11_page_101.png"
              alt={copy.imageAlt}
              referrerPolicy="no-referrer"
              className="block w-auto h-auto max-w-full max-h-[58svh] mx-auto rounded-lg object-contain"
            />
          </div>

          <p className="mt-3 text-xs text-amber-200/80 tracking-wide">
            {copy.credit}
          </p>
          <p className="mt-1 text-[11px] text-slate-400 break-all max-w-full px-2">
            {language === 'en' ? 'Source: ' : 'Fuente: '}
            <a
              href={`${NASA_PDF_SOURCE_URL}#page=101`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-amber-300 transition-colors"
            >
              <span>{NASA_PDF_SOURCE_URL}</span>
              <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
            </a>
          </p>
        </div>

        <div className="mt-3">
          <a
            href="/assets/aistudio/apollo11_page_101.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2 rounded-full bg-[#07194d] hover:bg-[#0b256e] border border-amber-300/30 text-xs sm:text-sm font-semibold text-amber-200 hover:text-amber-100 transition-colors"
          >
            <span>{copy.openPdf}</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}

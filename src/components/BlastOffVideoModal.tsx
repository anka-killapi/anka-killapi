import { useEffect, useRef, useState } from 'react';
import { ExternalLink, RotateCcw } from 'lucide-react';
import type { LanguageCode } from '../data/storyData';

interface BlastOffVideoModalProps {
  open: boolean;
  language: LanguageCode;
  onClose: () => void;
}

const CLIP_START_SECONDS = 6;
const CLIP_END_SECONDS = 25;

const NASA_DETAILS_URL =
  'https://images.nasa.gov/details/Apollo_11_Introduction_720p';
const NASA_VIDEO_MEDIUM_MP4 =
  'https://images-assets.nasa.gov/video/Apollo_11_Introduction_720p/Apollo_11_Introduction_720p~medium.mp4#t=6,25';
const NASA_VIDEO_SMALL_MP4 =
  'https://images-assets.nasa.gov/video/Apollo_11_Introduction_720p/Apollo_11_Introduction_720p~small.mp4#t=6,25';
const NASA_VIDEO_POSTER =
  'https://images-assets.nasa.gov/video/Apollo_11_Introduction_720p/Apollo_11_Introduction_720p~medium.jpg';

export function BlastOffVideoModal({
  open,
  language,
  onClose,
}: BlastOffVideoModalProps) {
  const nasaVideoRef = useRef<HTMLVideoElement | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [clipEnded, setClipEnded] = useState(false);

  function stopAndClose() {
    const videoEl = nasaVideoRef.current;
    if (videoEl) {
      videoEl.pause();
      videoEl.currentTime = CLIP_START_SECONDS;
    }
    setClipEnded(false);
    onClose();
  }

  useEffect(() => {
    if (!open) {
      const videoEl = nasaVideoRef.current;
      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = CLIP_START_SECONDS;
      }
      setClipEnded(false);
      return;
    }

    setVideoFailed(false);
    setClipEnded(false);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        stopAndClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  if (!open) return null;

  const copy =
    language === 'en'
      ? {
          heading: '🚀 Watch Apollo 11 Blast Off!',
          credit: 'Video credit: NASA',
          closeLabel: 'Close video modal',
          replayLabel: 'Replay Blast Off (0:06 – 0:25)',
          fallbackMessage:
            'Unable to load the video stream directly in this browser.',
          fallbackLink: 'Watch on NASA’s Official Website',
        }
      : {
          heading: '🚀 ¡Mira cómo despegó el Apollo 11!',
          credit: 'Video credit: NASA',
          closeLabel: 'Cerrar ventana de video',
          replayLabel: 'Volver a ver el despegue (0:06 – 0:25)',
          fallbackMessage:
            'No se pudo cargar el video directamente en este navegador.',
          fallbackLink: 'Ver video en el sitio oficial de la NASA',
        };

  function handleLoadedMetadata() {
    const videoEl = nasaVideoRef.current;
    if (!videoEl) return;
    if (
      videoEl.currentTime < CLIP_START_SECONDS ||
      videoEl.currentTime >= CLIP_END_SECONDS
    ) {
      videoEl.currentTime = CLIP_START_SECONDS;
    }
    videoEl.play().catch(() => {});
  }

  function handleTimeUpdate() {
    const videoEl = nasaVideoRef.current;
    if (!videoEl) return;

    if (videoEl.currentTime < CLIP_START_SECONDS) {
      videoEl.currentTime = CLIP_START_SECONDS;
      return;
    }

    if (videoEl.currentTime >= CLIP_END_SECONDS) {
      videoEl.pause();
      videoEl.currentTime = CLIP_END_SECONDS;
      setClipEnded(true);
    } else if (clipEnded) {
      setClipEnded(false);
    }
  }

  function handleSeeking() {
    const videoEl = nasaVideoRef.current;
    if (!videoEl) return;
    if (videoEl.currentTime < CLIP_START_SECONDS) {
      videoEl.currentTime = CLIP_START_SECONDS;
    } else if (videoEl.currentTime >= CLIP_END_SECONDS) {
      videoEl.currentTime = CLIP_END_SECONDS;
      videoEl.pause();
      setClipEnded(true);
    } else if (clipEnded) {
      setClipEnded(false);
    }
  }

  function handlePlay() {
    const videoEl = nasaVideoRef.current;
    if (!videoEl) return;
    if (
      videoEl.currentTime < CLIP_START_SECONDS ||
      videoEl.currentTime >= CLIP_END_SECONDS
    ) {
      videoEl.currentTime = CLIP_START_SECONDS;
    }
    setClipEnded(false);
  }

  function handleReplay() {
    const videoEl = nasaVideoRef.current;
    if (!videoEl) return;
    setClipEnded(false);
    videoEl.currentTime = CLIP_START_SECONDS;
    videoEl.play().catch(() => {});
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="blastoff-modal-heading"
      onClick={stopAndClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#01071a]/80 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[92svh] overflow-y-auto rounded-2xl bg-[#041033] border border-amber-300/35 shadow-[0_24px_80px_rgba(1,6,24,0.9)] p-5 sm:p-8 text-center"
      >
        <button
          type="button"
          onClick={stopAndClose}
          aria-label={copy.closeLabel}
          className="absolute top-3.5 right-3.5 inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#07194d] hover:bg-[#0b256e] border border-amber-300/30 text-amber-200 hover:text-amber-100 text-lg font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          ✕
        </button>

        <h2
          id="blastoff-modal-heading"
          className="font-playful font-semibold text-2xl sm:text-3xl text-amber-300 pr-10 pl-10 mb-5 [text-wrap:balance]"
        >
          {copy.heading}
        </h2>

        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-amber-300/25 bg-black shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          {!videoFailed ? (
            <>
              <video
                ref={nasaVideoRef}
                controls
                playsInline
                autoPlay
                preload="metadata"
                poster={NASA_VIDEO_POSTER}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onSeeking={handleSeeking}
                onPlay={handlePlay}
                onError={() => setVideoFailed(true)}
                className="w-full h-full object-contain bg-black"
              >
                <source src={NASA_VIDEO_MEDIUM_MP4} type="video/mp4" />
                <source
                  src={NASA_VIDEO_SMALL_MP4}
                  type="video/mp4"
                  onError={() => setVideoFailed(true)}
                />
              </video>

              {clipEnded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#020b2c]/70 backdrop-blur-[2px]">
                  <button
                    type="button"
                    onClick={handleReplay}
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-full bg-gradient-to-b from-[#ffd426] to-[#f59e0b] hover:from-[#ffe055] hover:to-[#fbbf24] text-[#05102e] text-sm sm:text-base font-bold shadow-[0_8px_28px_rgba(245,158,11,0.4)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    <span>{copy.replayLabel}</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 bg-[#020b2c]">
              <p className="text-sm sm:text-base text-slate-200 max-w-md">
                {copy.fallbackMessage}
              </p>
              <a
                href={NASA_DETAILS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 min-h-[44px] px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-[#05102e] text-sm font-bold transition-colors"
              >
                <span>{copy.fallbackLink}</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-col items-center gap-1">
          <p className="text-xs text-amber-200/80 tracking-wide">
            {copy.credit}
          </p>
          <p className="text-[11px] text-slate-400 break-all max-w-full px-2">
            {language === 'en' ? 'Source: ' : 'Fuente: '}
            <a
              href={NASA_DETAILS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-amber-300 transition-colors"
            >
              {NASA_DETAILS_URL}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

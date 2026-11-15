import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Captions, Globe, Home, Play, Volume2 } from 'lucide-react';
import { CosmicBackdropWithHome } from './CosmicBackdropWithHome';
import type { LanguageCode } from '../data/storyData';

interface NeverForgottenPageProps {
  language: LanguageCode;
  onToggleLanguage: () => void;
  onBack: () => void;
  onGoHome: () => void;
}

interface CaptionCue {
  start: number;
  end: number;
  text: string;
}

const ENGLISH_CUES: CaptionCue[] = [
  {
    start: 0.0,
    end: 2.8,
    text: 'Friends, what an incredible adventure!',
  },
  {
    start: 2.8,
    end: 8.8,
    text: 'Today we discovered that when the Apollo 11 astronauts reached the Moon in 1969,',
  },
  {
    start: 8.8,
    end: 12.6,
    text: 'they left behind very special objects that are still there today.',
  },
  {
    start: 12.6,
    end: 17.5,
    text: 'Eagle’s base, a laser mirror, and a moonquake detector.',
  },
  {
    start: 17.5,
    end: 23.0,
    text: 'Each one has a story to tell and helps us understand how we explore the Moon.',
  },
  {
    start: 23.0,
    end: 29.5,
    text: 'Even though many years have passed, these objects are part of our history, and we must never forget them.',
  },
  {
    start: 29.5,
    end: 35.1,
    text: 'We will never forget what you left behind on the Moon!',
  },
];

export function NeverForgottenPage({
  language,
  onToggleLanguage,
  onBack,
  onGoHome,
}: NeverForgottenPageProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [needsManualPlay, setNeedsManualPlay] = useState(false);
  const [mutedAutoplay, setMutedAutoplay] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(language === 'en');
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const copy =
    language === 'en'
      ? {
          title: '🌕 Never Forgotten',
          subtitle:
            'We will never forget what the Apollo 11 astronauts left behind on the Moon!',
          back: 'Back',
          switchLabel: 'Español',
          playLabel: 'Play Video',
          unmuteLabel: 'Tap for Sound',
          captionsOn: 'CC On',
          captionsOff: 'CC Off',
          startOver: 'Start Adventure Again',
          aiDisclosure:
            'AI Disclosure: This video was created using generative AI for educational and illustrative purposes. It is not actual footage from the Apollo 11 mission.',
        }
      : {
          title: '🌕 Nunca olvidados',
          subtitle:
            '¡Nunca olvidaremos lo que los astronautas del Apollo 11 dejaron en la Luna!',
          back: 'Volver',
          switchLabel: 'English',
          playLabel: 'Reproducir video',
          unmuteLabel: 'Activar sonido',
          captionsOn: 'Subtítulos',
          captionsOff: 'Sin subtítulos',
          startOver: 'Comenzar desde el inicio',
          aiDisclosure:
            'Aviso sobre el uso de IA: Este video fue creado con inteligencia artificial generativa con fines educativos e ilustrativos. No corresponde a imágenes reales de la misión Apollo 11.',
        };

  useEffect(() => {
    setCaptionsEnabled(language === 'en');
  }, [language]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const syncTracks = () => {
      const track = videoEl.textTracks?.[0];
      if (!track) return;
      if (captionsEnabled && isFullscreen) {
        track.mode = 'showing';
      } else if (captionsEnabled) {
        track.mode = 'hidden';
      } else {
        track.mode = 'disabled';
      }
    };

    syncTracks();
    const tracks = videoEl.textTracks;
    tracks?.addEventListener?.('addtrack', syncTracks);
    return () => {
      tracks?.removeEventListener?.('addtrack', syncTracks);
    };
  }, [captionsEnabled, isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        videoEl.muted = true;
        setMutedAutoplay(true);
        videoEl.play().catch(() => {
          setMutedAutoplay(false);
          setNeedsManualPlay(true);
        });
      });
    }
  }, []);

  function handleManualPlay() {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    videoEl.muted = false;
    setMutedAutoplay(false);
    videoEl
      .play()
      .then(() => {
        setNeedsManualPlay(false);
      })
      .catch(() => {
        setNeedsManualPlay(false);
      });
  }

  function handleUnmute() {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    videoEl.muted = false;
    setMutedAutoplay(false);
  }

  const activeCue =
    captionsEnabled && !isFullscreen
      ? ENGLISH_CUES.find(
          (cue) => currentTime >= cue.start && currentTime <= cue.end
        )
      : undefined;

  return (
    <section className="relative w-full min-h-[100svh] bg-gradient-to-b from-[#010924] via-[#031c5e] to-[#0a63e0] flex flex-col justify-between overflow-hidden">
      <CosmicBackdropWithHome language={language} onGoHome={onGoHome} />

      {/* Top-right navigation controls */}
      <header className="relative z-20 w-full pl-40 pr-4 sm:pl-60 sm:pr-8 pt-4 sm:pt-6 flex flex-wrap items-center justify-end gap-2.5 sm:gap-3">
        {language === 'en' && (
          <button
            type="button"
            onClick={() => setCaptionsEnabled((prev) => !prev)}
            aria-pressed={captionsEnabled}
            className={`inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-full border backdrop-blur-md text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              captionsEnabled
                ? 'bg-amber-400 text-[#05102e] border-amber-300 font-semibold'
                : 'bg-[#020b2c]/65 hover:bg-[#020b2c]/85 text-slate-100 border-white/15'
            }`}
          >
            <Captions className="w-4 h-4" aria-hidden="true" />
            <span>{captionsEnabled ? copy.captionsOn : copy.captionsOff}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onToggleLanguage}
          className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-full bg-[#020b2c]/65 hover:bg-[#020b2c]/85 border border-white/15 backdrop-blur-md text-xs sm:text-sm font-medium text-slate-100 hover:text-amber-300 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <Globe className="w-3.5 h-3.5 text-sky-200" aria-hidden="true" />
          <span>{copy.switchLabel}</span>
        </button>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-2 rounded-full bg-[#020b2c]/65 hover:bg-[#020b2c]/85 border border-white/15 backdrop-blur-md text-xs sm:text-sm font-medium text-slate-100 hover:text-amber-300 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{copy.back}</span>
        </button>
      </header>

      {/* Center Title & Final Celebration Video */}
      <div className="relative z-10 flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-5 sm:gap-6 px-4 sm:px-8 py-4 sm:py-8">
        <div className="text-center max-w-3xl space-y-2">
          <h1 className="font-playful font-semibold text-2xl sm:text-4xl md:text-5xl tracking-wide text-amber-300 drop-shadow-[0_4px_18px_rgba(2,11,44,0.85)] [text-wrap:balance]">
            {copy.title}
          </h1>
          <p className="text-xs sm:text-base text-sky-100/90 max-w-2xl mx-auto">
            {copy.subtitle}
          </p>
        </div>

        <div className="w-full flex flex-col items-center gap-4">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-sky-200/20 bg-[#010820] shadow-[0_24px_80px_rgba(1,8,34,0.8)]">
            <video
              ref={videoRef}
              controls
              autoPlay
              playsInline
              preload="auto"
              onPlay={() => setNeedsManualPlay(false)}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onVolumeChange={() => {
                if (videoRef.current && !videoRef.current.muted) {
                  setMutedAutoplay(false);
                }
              }}
              className="w-full h-full object-contain bg-black"
            >
              <source
                src="/assets/aistudio/We_will_never_forget_what_you_left_behind_on_the_Moon__5489ec12.mp4"
                type="video/mp4"
              />
              <track
                kind="captions"
                src="/assets/aistudio/never-forgotten-captions-en.vtt"
                srcLang="en"
                label="English"
                default={language === 'en'}
              />
            </video>

            {activeCue && !needsManualPlay && (
              <div
                aria-live="polite"
                className="pointer-events-none absolute inset-x-4 bottom-12 sm:bottom-14 flex justify-center"
              >
                <p className="px-4 py-2 rounded-xl bg-[#020b2c]/88 border border-white/15 backdrop-blur-sm text-white font-playful font-medium text-sm sm:text-lg md:text-xl text-center leading-snug shadow-lg max-w-[92%]">
                  {activeCue.text}
                </p>
              </div>
            )}

            {needsManualPlay && (
              <button
                type="button"
                onClick={handleManualPlay}
                aria-label={copy.playLabel}
                className="absolute inset-0 flex items-center justify-center bg-[#020b2c]/45 hover:bg-[#020b2c]/30 transition-colors cursor-pointer"
              >
                <span className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-b from-[#ffd426] to-[#f59e0b] text-[#05102e] text-sm sm:text-base font-bold shadow-[0_8px_32px_rgba(245,158,11,0.45)]">
                  <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                  <span>{copy.playLabel}</span>
                </span>
              </button>
            )}
          </div>

          {mutedAutoplay && !needsManualPlay && (
            <button
              type="button"
              onClick={handleUnmute}
              className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-[#05102e] text-xs sm:text-sm font-bold shadow-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" />
              <span>{copy.unmuteLabel}</span>
            </button>
          )}

          <p className="text-xs sm:text-sm text-sky-100/80 text-center max-w-2xl mx-auto leading-relaxed [text-wrap:balance]">
            {copy.aiDisclosure}
          </p>

          <button
            type="button"
            onClick={() => {
              videoRef.current?.pause();
              onGoHome();
            }}
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-7 py-3 rounded-full bg-gradient-to-b from-[#ffd426] to-[#f59e0b] hover:from-[#ffe055] hover:to-[#fbbf24] text-[#05102e] font-playful font-bold text-sm sm:text-base shadow-[0_8px_28px_rgba(245,158,11,0.42)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>{copy.startOver}</span>
          </button>
        </div>
      </div>

      {/* Bottom spacer for balanced vertical centering */}
      <div aria-hidden="true" className="h-4 sm:h-8 shrink-0" />
    </section>
  );
}

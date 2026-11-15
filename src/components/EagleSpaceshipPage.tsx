import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Captions, ChevronRight, Globe, Play, Volume2 } from 'lucide-react';
import { CosmicBackdropWithHome } from './CosmicBackdropWithHome';
import { LunarModuleBlueprintModal } from './LunarModuleBlueprintModal';
import { RealMoonwalkModal } from './RealMoonwalkModal';
import type { LanguageCode } from '../data/storyData';

interface EagleSpaceshipPageProps {
  language: LanguageCode;
  onToggleLanguage: () => void;
  onBack: () => void;
  onGoHome: () => void;
  onExploreMoonArtifacts: () => void;
}

interface CaptionCue {
  start: number;
  end: number;
  text: string;
}

const ENGLISH_CUES: CaptionCue[] = [
  {
    start: 0.0,
    end: 3.3,
    text: 'Meet Eagle, the spacecraft that landed on the Moon!',
  },
  {
    start: 3.6,
    end: 10.7,
    text: 'In 1969, Neil Armstrong and Buzz Aldrin reached the Moon in a small spacecraft named Eagle.',
  },
  {
    start: 11.0,
    end: 13.3,
    text: 'They landed in the Sea of Tranquility.',
  },
  {
    start: 13.6,
    end: 18.7,
    text: 'The mission was a success! But did you know Eagle had two parts?',
  },
  {
    start: 19.2,
    end: 24.0,
    text: 'The top part was the astronauts’ cabin—it had an engine to fly back to space.',
  },
  {
    start: 24.5,
    end: 28.7,
    text: 'The bottom part had four legs that helped it land gently.',
  },
  {
    start: 29.3,
    end: 33.8,
    text: 'The astronauts walked on the Moon, collected rocks, and took photographs.',
  },
  {
    start: 34.3,
    end: 38.6,
    text: 'After more than 21 hours, it was time to depart!',
  },
  {
    start: 38.6,
    end: 43.7,
    text: 'The top part blasted off to reunite with Columbia, where Michael Collins was waiting.',
  },
  {
    start: 44.2,
    end: 50.6,
    text: 'And the bottom part stayed on the Moon—and it’s still there after 57 years!',
  },
];

export function EagleSpaceshipPage({
  language,
  onToggleLanguage,
  onBack,
  onGoHome,
  onExploreMoonArtifacts,
}: EagleSpaceshipPageProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [needsManualPlay, setNeedsManualPlay] = useState(false);
  const [mutedAutoplay, setMutedAutoplay] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(language === 'en');
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [moonwalkModalOpen, setMoonwalkModalOpen] = useState(false);
  const [blueprintModalOpen, setBlueprintModalOpen] = useState(false);

  const copy =
    language === 'en'
      ? {
          title: '🌙 Explore Eagle, the Moon Spaceship! 🚀',
          back: 'Back',
          switchLabel: 'Español',
          playLabel: 'Play Video',
          unmuteLabel: 'Tap for Sound',
          captionsOn: 'CC On',
          captionsOff: 'CC Off',
          moonwalkLink: '👨‍🚀 Watch the Real Moonwalk!',
          blueprintLink: '📐 Explore Eagle’s Blueprint! (Page 101)',
          moonArtifactsLink: '🌕 What else was left on the Moon?',
          aiDisclosure:
            'AI Disclosure: This video was created using generative AI for educational and illustrative purposes. It is not actual footage from the Apollo 11 mission.',
        }
      : {
          title: '🌙 ¡Explora el Eagle, la nave lunar! 🚀',
          back: 'Volver',
          switchLabel: 'English',
          playLabel: 'Reproducir video',
          unmuteLabel: 'Activar sonido',
          captionsOn: 'Subtítulos',
          captionsOff: 'Sin subtítulos',
          moonwalkLink: '👨‍🚀 ¡Mira la caminata lunar real!',
          blueprintLink: '📐 ¡Explora el plano del Eagle! (Pág. 101)',
          moonArtifactsLink: '🌕 ¿Qué más se quedó en la Luna?',
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

      {/* Center Responsive Title, Video & Right-Side Link */}
      <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto flex flex-col items-center justify-center gap-5 sm:gap-7 px-4 sm:px-8 py-4 sm:py-8">
        <h1 className="font-playful font-semibold text-2xl sm:text-4xl md:text-5xl tracking-wide text-center text-amber-300 drop-shadow-[0_4px_18px_rgba(2,11,44,0.85)] max-w-3xl [text-wrap:balance]">
          {copy.title}
        </h1>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-center">
          <div className="lg:col-span-8 flex flex-col items-center gap-3.5">
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
                  src="/assets/aistudio/FULL_ANIMATION3_d687e29d.mp4"
                  type="video/mp4"
                />
                <track
                  kind="captions"
                  src="/assets/aistudio/eagle-captions-en.vtt"
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
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-3.5">
            <a
              href="#real-moonwalk"
              onClick={(e) => {
                e.preventDefault();
                videoRef.current?.pause();
                setMoonwalkModalOpen(true);
              }}
              className="group flex items-center justify-between gap-3 w-full min-h-[60px] px-5 py-4 rounded-2xl border bg-[#020b2c]/72 hover:bg-[#051854]/85 border-sky-200/20 hover:border-amber-300/70 backdrop-blur-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span className="font-playful font-semibold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors leading-snug">
                {copy.moonwalkLink}
              </span>
              <ChevronRight
                className="w-5 h-5 shrink-0 text-amber-300 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>

            <button
              type="button"
              onClick={() => {
                videoRef.current?.pause();
                setBlueprintModalOpen(true);
              }}
              className="group flex items-center justify-between gap-3 w-full min-h-[60px] px-5 py-4 rounded-2xl border bg-[#020b2c]/72 hover:bg-[#051854]/85 border-sky-200/20 hover:border-amber-300/70 backdrop-blur-md text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span className="font-playful font-semibold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors leading-snug">
                {copy.blueprintLink}
              </span>
              <ChevronRight
                className="w-5 h-5 shrink-0 text-amber-300 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={() => {
                videoRef.current?.pause();
                onExploreMoonArtifacts();
              }}
              className="group flex items-center justify-between gap-3 w-full min-h-[60px] px-5 py-4 rounded-2xl border bg-[#020b2c]/72 hover:bg-[#051854]/85 border-sky-200/20 hover:border-amber-300/70 backdrop-blur-md text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span className="font-playful font-semibold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors leading-snug">
                {copy.moonArtifactsLink}
              </span>
              <ChevronRight
                className="w-5 h-5 shrink-0 text-amber-300 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          </aside>
        </div>
      </div>

      {/* Bottom spacer for balanced vertical centering */}
      <div aria-hidden="true" className="h-4 sm:h-8 shrink-0" />

      <RealMoonwalkModal
        open={moonwalkModalOpen}
        language={language}
        onClose={() => setMoonwalkModalOpen(false)}
      />

      <LunarModuleBlueprintModal
        open={blueprintModalOpen}
        language={language}
        onClose={() => setBlueprintModalOpen(false)}
      />
    </section>
  );
}

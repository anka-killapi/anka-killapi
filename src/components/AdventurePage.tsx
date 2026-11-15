import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Captions, ChevronRight, Globe, Play, Volume2 } from 'lucide-react';
import { BlastOffVideoModal } from './BlastOffVideoModal';
import { CosmicBackdropWithHome } from './CosmicBackdropWithHome';
import { EagleInsigniaModal } from './EagleInsigniaModal';
import type { LanguageCode } from '../data/storyData';

interface AdventurePageProps {
  language: LanguageCode;
  onToggleLanguage: () => void;
  onBack: () => void;
  onGoHome: () => void;
  onExploreEagle: () => void;
}

interface CaptionCue {
  start: number;
  end: number;
  text: string;
}

type ChapterTopicId = 'eagle' | 'blastoff';

interface ChapterLink {
  id: ChapterTopicId;
  seekTo: number;
  label: Record<LanguageCode, string>;
  fact: Record<LanguageCode, string>;
}

const ENGLISH_CUES: CaptionCue[] = [
  { start: 0.4, end: 1.6, text: 'Anka Killapi!' },
  { start: 1.9, end: 4.45, text: 'Did you know that in 1969,' },
  { start: 4.5, end: 6.1, text: 'a spacecraft named Eagle' },
  {
    start: 6.15,
    end: 9.25,
    text: 'carried the first astronauts who walked on the Moon?',
  },
  { start: 9.45, end: 19.5, text: '♪ Eagle lands on the Moon ♪' },
];

const CHAPTER_LINKS: ChapterLink[] = [
  {
    id: 'eagle',
    seekTo: 6.2,
    label: {
      es: '🦅 ¡Descubre el águila del Apollo 11!',
      en: '🦅 Discover the Eagle of Apollo 11!',
    },
    fact: {
      es: 'El módulo lunar se llamó Eagle («Águila», o Anka en quechua) y posó suavemente a los primeros astronautas sobre la Luna en 1969.',
      en: 'The Lunar Module was named Eagle (Anka in Quechua) and gently carried the first astronauts down onto the Moon in 1969.',
    },
  },
  {
    id: 'blastoff',
    seekTo: 0,
    label: {
      es: '🚀 ¡Mira cómo despegó el Apollo 11!',
      en: '🚀 Watch Apollo 11 Blast Off!',
    },
    fact: {
      es: 'El gigante cohete Saturn V medía 110 metros de altura y encendió cinco motores enormes para escapar de la gravedad terrestre.',
      en: 'The mighty Saturn V rocket stood 363 feet tall and fired five giant engines to soar beyond Earth’s gravity.',
    },
  },
];

export function AdventurePage({
  language,
  onToggleLanguage,
  onBack,
  onGoHome,
  onExploreEagle,
}: AdventurePageProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [needsManualPlay, setNeedsManualPlay] = useState(false);
  const [mutedAutoplay, setMutedAutoplay] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(language === 'en');
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<ChapterTopicId | null>(
    null
  );
  const [eagleModalOpen, setEagleModalOpen] = useState(false);
  const [blastOffModalOpen, setBlastOffModalOpen] = useState(false);

  const copy =
    language === 'en'
      ? {
          title: '🚀 Apollo 11: Journey to the Moon!',
          back: 'Back',
          switchLabel: 'Español',
          playLabel: 'Play Video',
          unmuteLabel: 'Tap for Sound',
          captionsOn: 'CC On',
          captionsOff: 'CC Off',
          exploreHeading: 'Explore the Mission',
          exploreEagleButton: "🌙 Let's Explore Eagle, the Moon Spaceship! 🚀",
          aiDisclosure:
            'AI Disclosure: This video was created using generative AI for educational and illustrative purposes. It is not actual footage from the Apollo 11 mission.',
        }
      : {
          title: '🚀 Apollo 11: ¡Rumbo a la Luna!',
          back: 'Volver',
          switchLabel: 'English',
          playLabel: 'Reproducir video',
          unmuteLabel: 'Activar sonido',
          captionsOn: 'Subtítulos',
          captionsOff: 'Sin subtítulos',
          exploreHeading: 'Explora la Misión',
          exploreEagleButton: '🌙 ¡Vamos a explorar el Eagle, la nave lunar! 🚀',
          aiDisclosure:
            'Aviso sobre el uso de IA: Este video fue creado con inteligencia artificial generativa con fines educativos e ilustrativos. No corresponde a imágenes reales de la misión Apollo 11.',
        };

  // Automatically enable English captions when English is active, disable in Spanish
  useEffect(() => {
    setCaptionsEnabled(language === 'en');
  }, [language]);

  // Keep native WebVTT track synchronized for fullscreen / native accessibility
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

  function handleSelectChapter(chapter: ChapterLink) {
    if (chapter.id === 'eagle') {
      videoRef.current?.pause();
      setEagleModalOpen(true);
      return;
    }

    if (chapter.id === 'blastoff') {
      videoRef.current?.pause();
      setBlastOffModalOpen(true);
      return;
    }

    setSelectedChapter(chapter.id);
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.currentTime = chapter.seekTo;
    setCurrentTime(chapter.seekTo);
    setNeedsManualPlay(false);
    videoEl.play().catch(() => {
      videoEl.muted = true;
      setMutedAutoplay(true);
      videoEl.play().catch(() => {
        setNeedsManualPlay(true);
      });
    });
  }

  const activeCue =
    captionsEnabled && !isFullscreen
      ? ENGLISH_CUES.find(
          (cue) => currentTime >= cue.start && currentTime <= cue.end
        )
      : undefined;

  const activeFactChapter = CHAPTER_LINKS.find(
    (item) => item.id === selectedChapter
  );

  return (
    <section className="relative w-full min-h-[100svh] bg-gradient-to-b from-[#010924] via-[#031c5e] to-[#0a63e0] flex flex-col justify-between overflow-hidden">
      <CosmicBackdropWithHome language={language} onGoHome={onGoHome} />

      {/* Top-right controls (keeps top-left Anka Killapi eagle logo completely clear) */}
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

      {/* Center Responsive Title + Video & Right-Side Links */}
      <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto flex flex-col items-center justify-center gap-5 sm:gap-7 px-4 sm:px-8 py-6 sm:py-8">
        <h1 className="font-playful font-semibold text-2xl sm:text-4xl md:text-5xl tracking-wide text-center text-amber-300 drop-shadow-[0_4px_18px_rgba(2,11,44,0.85)] max-w-3xl [text-wrap:balance]">
          {copy.title}
        </h1>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-center">
          {/* Main Video Stage */}
          <div className="lg:col-span-8 flex flex-col items-center gap-3">
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
                  src="/assets/aistudio/presentation__1Anka_Killapi_e4a44c5c.mp4"
                  type="video/mp4"
                />
                <track
                  kind="captions"
                  src="/assets/aistudio/captions-en.vtt"
                  srcLang="en"
                  label="English"
                  default={language === 'en'}
                />
              </video>

              {/* High-contrast synchronized English caption overlay */}
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

          {/* Right Side Interactive Discovery Links */}
          <aside
            aria-label={copy.exploreHeading}
            className="lg:col-span-4 flex flex-col gap-3.5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
              {CHAPTER_LINKS.map((chapter) => {
                const isSelected = selectedChapter === chapter.id;
                return (
                  <a
                    key={chapter.id}
                    href={`#${chapter.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelectChapter(chapter);
                    }}
                    className={`group flex items-center justify-between gap-3 min-h-[60px] px-5 py-4 rounded-2xl border backdrop-blur-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      isSelected
                        ? 'bg-[#07236b]/90 border-amber-300 shadow-[0_8px_28px_rgba(251,191,36,0.22)]'
                        : 'bg-[#020b2c]/72 hover:bg-[#051854]/85 border-sky-200/20 hover:border-amber-300/70'
                    }`}
                  >
                    <span className="font-playful font-semibold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {chapter.label[language]}
                    </span>
                    <ChevronRight
                      className="w-5 h-5 shrink-0 text-amber-300 transition-transform duration-150 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                videoRef.current?.pause();
                onExploreEagle();
              }}
              className="group flex items-center justify-between gap-3 w-full min-h-[60px] px-5 py-4 rounded-2xl border bg-[#020b2c]/72 hover:bg-[#051854]/85 border-sky-200/20 hover:border-amber-300/70 backdrop-blur-md text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span className="font-playful font-semibold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors leading-snug">
                {copy.exploreEagleButton}
              </span>
              <ChevronRight
                className="w-5 h-5 shrink-0 text-amber-300 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>

            {activeFactChapter && (
              <div className="rounded-2xl bg-[#020b2c]/78 border border-sky-200/20 backdrop-blur-md px-5 py-4">
                <p className="font-playful font-semibold text-sm text-amber-300 mb-1">
                  {activeFactChapter.label[language]}
                </p>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {activeFactChapter.fact[language]}
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Bottom spacer for balanced vertical centering */}
      <div aria-hidden="true" className="h-4 sm:h-6 shrink-0" />

      <EagleInsigniaModal
        open={eagleModalOpen}
        language={language}
        onClose={() => setEagleModalOpen(false)}
      />

      <BlastOffVideoModal
        open={blastOffModalOpen}
        language={language}
        onClose={() => setBlastOffModalOpen(false)}
      />
    </section>
  );
}

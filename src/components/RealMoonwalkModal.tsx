import { useEffect, useRef, useState } from 'react';
import {
  Captions,
  ExternalLink,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { LanguageCode } from '../data/storyData';
import { getMoonwalkSpanishCaption } from '../data/moonwalkCaptionsEs';

interface RealMoonwalkModalProps {
  open: boolean;
  language: LanguageCode;
  onClose: () => void;
}

const CLIP_START = 535; // 8:55
const CLIP_END = 1085; // 18:05
const NASA_VIDEO_ID = 'qUe5IpDBcsM';
const NASA_SOURCE_URL =
  'https://www.nasa.gov/stem-content/destination-the-moon/';

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  unloadModule?: (module: string) => void;
  setOption?: (module: string, option: string, value: unknown) => void;
  destroy: () => void;
}

interface YTNamespace {
  Player: new (
    element: HTMLElement | string,
    options: {
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: { target: YTPlayerInstance }) => void;
        onApiChange?: (event: { target: YTPlayerInstance }) => void;
        onStateChange?: (event: {
          data: number;
          target: YTPlayerInstance;
        }) => void;
        onError?: () => void;
      };
    }
  ) => YTPlayerInstance;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
  };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function formatTime(totalSeconds: number): string {
  const clamped = Math.max(CLIP_START, Math.min(CLIP_END, Math.floor(totalSeconds)));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function disableYouTubeCaptions(player: YTPlayerInstance) {
  try {
    player.setOption?.('captions', 'track', {});
    player.unloadModule?.('captions');
    player.unloadModule?.('cc');
  } catch {
    // ignore if captions module is not attached
  }
}

export function RealMoonwalkModal({
  open,
  language,
  onClose,
}: RealMoonwalkModalProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const playerMountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(CLIP_START);
  const [clipEnded, setClipEnded] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpanishCaptions, setShowSpanishCaptions] = useState(
    language === 'es'
  );

  useEffect(() => {
    setShowSpanishCaptions(language === 'es');
  }, [language, open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore cleanup errors
        }
        playerRef.current = null;
      }
      return;
    }

    let cancelled = false;
    let pollInterval: number | undefined;

    setCurrentTime(CLIP_START);
    setClipEnded(false);
    setIsPlaying(true);
    setApiFailed(false);

    const mountPlayer = () => {
      if (cancelled || !playerMountRef.current || !window.YT?.Player) return;

      playerRef.current = new window.YT.Player(playerMountRef.current, {
        videoId: NASA_VIDEO_ID,
        playerVars: {
          start: CLIP_START,
          end: CLIP_END,
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          cc_load_policy: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: ({ target }) => {
            if (cancelled) return;
            disableYouTubeCaptions(target);
            target.seekTo(CLIP_START, true);
            target.playVideo();

            pollInterval = window.setInterval(() => {
              if (!playerRef.current) return;
              const now = playerRef.current.getCurrentTime();
              if (typeof now !== 'number' || Number.isNaN(now)) return;

              if (now < CLIP_START - 0.5) {
                playerRef.current.seekTo(CLIP_START, true);
                setCurrentTime(CLIP_START);
                return;
              }

              if (now >= CLIP_END) {
                playerRef.current.pauseVideo();
                playerRef.current.seekTo(CLIP_END, true);
                setCurrentTime(CLIP_END);
                setIsPlaying(false);
                setClipEnded(true);
                return;
              }

              setCurrentTime(now);
            }, 250);
          },
          onApiChange: ({ target }) => {
            if (cancelled) return;
            disableYouTubeCaptions(target);
          },
          onStateChange: ({ data, target }) => {
            if (cancelled) return;
            const YTState = window.YT?.PlayerState;
            if (!YTState) return;

            if (data === YTState.PLAYING) {
              disableYouTubeCaptions(target);
              const now = target.getCurrentTime();
              if (now < CLIP_START - 0.5 || now >= CLIP_END) {
                target.seekTo(CLIP_START, true);
                setCurrentTime(CLIP_START);
              }
              setIsPlaying(true);
              setClipEnded(false);
            } else if (data === YTState.PAUSED) {
              setIsPlaying(false);
            } else if (data === YTState.ENDED) {
              target.seekTo(CLIP_END, true);
              setCurrentTime(CLIP_END);
              setIsPlaying(false);
              setClipEnded(true);
            }
          },
          onError: () => {
            if (!cancelled) setApiFailed(true);
          },
        },
      });
    };

    if (window.YT?.Player) {
      mountPlayer();
    } else {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[src="https://www.youtube.com/iframe_api"]'
      );
      const prevReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prevReady?.();
        mountPlayer();
      };

      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        script.onerror = () => {
          if (!cancelled) setApiFailed(true);
        };
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (pollInterval !== undefined) {
        window.clearInterval(pollInterval);
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore cleanup errors
        }
        playerRef.current = null;
      }
    };
  }, [open]);

  if (!open) return null;

  const copy =
    language === 'en'
      ? {
          heading: '👨‍🚀 Watch the Real Moonwalk!',
          subtitle: 'Locked segment: 08:55 – 18:05',
          credit: 'Video credit: NASA',
          closeLabel: 'Close video modal',
          play: 'Play',
          pause: 'Pause',
          mute: 'Mute',
          unmute: 'Unmute',
          replay: 'Replay Moonwalk (08:55 – 18:05)',
          fullscreen: 'Toggle fullscreen',
          toggleCaptions: 'Toggle Spanish translation captions',
          captionsBadge: 'ES',
        }
      : {
          heading: '👨‍🚀 ¡Mira la caminata lunar real!',
          subtitle: 'Segmento bloqueado: 08:55 – 18:05 · Traducción al español',
          credit: 'Video credit: NASA',
          closeLabel: 'Cerrar ventana de video',
          play: 'Reproducir',
          pause: 'Pausar',
          mute: 'Silenciar',
          unmute: 'Activar sonido',
          replay: 'Repetir caminata lunar (08:55 – 18:05)',
          fullscreen: 'Pantalla completa',
          toggleCaptions: 'Mostrar u ocultar traducción al español',
          captionsBadge: 'ES',
        };

  const activeSpanishCue =
    showSpanishCaptions && !apiFailed && !clipEnded
      ? getMoonwalkSpanishCaption(currentTime)
      : null;

  function handleTogglePlay() {
    const player = playerRef.current;
    if (!player) return;

    if (clipEnded) {
      handleReplay();
      return;
    }

    if (isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
    } else {
      const now = player.getCurrentTime();
      if (now < CLIP_START || now >= CLIP_END) {
        player.seekTo(CLIP_START, true);
        setCurrentTime(CLIP_START);
      }
      player.playVideo();
      setIsPlaying(true);
    }
  }

  function handleReplay() {
    const player = playerRef.current;
    if (!player) return;
    setClipEnded(false);
    setCurrentTime(CLIP_START);
    player.seekTo(CLIP_START, true);
    player.playVideo();
    setIsPlaying(true);
  }

  function handleSeek(nextSeconds: number) {
    const player = playerRef.current;
    if (!player) return;
    const clamped = Math.max(CLIP_START, Math.min(CLIP_END - 0.5, nextSeconds));
    setClipEnded(false);
    setCurrentTime(clamped);
    player.seekTo(clamped, true);
  }

  function handleToggleMute() {
    const player = playerRef.current;
    if (!player) return;
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  }

  function handleToggleFullscreen() {
    const el = stageRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="moonwalk-modal-heading"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#01071a]/80 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[92svh] overflow-y-auto rounded-2xl bg-[#041033] border border-amber-300/35 shadow-[0_24px_80px_rgba(1,6,24,0.9)] p-5 sm:p-8 text-center"
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
          id="moonwalk-modal-heading"
          className="font-playful font-semibold text-2xl sm:text-3xl text-amber-300 pr-10 pl-10 mb-1.5 [text-wrap:balance]"
        >
          {copy.heading}
        </h2>
        <p className="text-xs sm:text-sm text-sky-200/85 mb-5">
          {copy.subtitle}
        </p>

        <div
          ref={stageRef}
          className="w-full rounded-xl overflow-hidden border border-amber-300/25 bg-black shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col justify-center"
        >
          <div className="relative w-full aspect-video bg-black my-auto">
            {!apiFailed ? (
              <>
                <div ref={playerMountRef} className="w-full h-full" />
                {/* Transparent interaction shield so users cannot click native YouTube scrub/links outside 8:55-18:05 */}
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  aria-label={isPlaying ? copy.pause : copy.play}
                  className="absolute inset-0 w-full h-full bg-transparent cursor-pointer focus:outline-none"
                />
              </>
            ) : (
              <iframe
                title="The Flight of Apollo 11 — Real Moonwalk (8:55 to 18:05)"
                src={`https://www.youtube.com/embed/${NASA_VIDEO_ID}?start=${CLIP_START}&end=${CLIP_END}&autoplay=1&controls=0&disablekb=1&cc_load_policy=0&iv_load_policy=3&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-full border-0"
              />
            )}

            {activeSpanishCue && (
              <div
                aria-live="polite"
                className="pointer-events-none absolute inset-x-0 bottom-3 sm:bottom-5 z-10 flex justify-center px-3 sm:px-6"
              >
                <div className="max-w-2xl rounded-xl bg-[#020b2c]/88 backdrop-blur-md border border-amber-300/35 px-3.5 py-2 sm:px-5 sm:py-2.5 shadow-[0_8px_28px_rgba(0,0,0,0.8)]">
                  {activeSpanishCue.speaker && (
                    <p className="text-[11px] sm:text-xs font-bold tracking-wide text-amber-300 mb-0.5">
                      {activeSpanishCue.speaker}
                    </p>
                  )}
                  <p className="font-playful font-medium text-sm sm:text-base md:text-lg leading-snug text-white">
                    {activeSpanishCue.text}
                  </p>
                </div>
              </div>
            )}

            {clipEnded && !apiFailed && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#020b2c]/75 backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={handleReplay}
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-full bg-gradient-to-b from-[#ffd426] to-[#f59e0b] hover:from-[#ffe055] hover:to-[#fbbf24] text-[#05102e] text-sm sm:text-base font-bold shadow-[0_8px_28px_rgba(245,158,11,0.4)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>{copy.replay}</span>
                </button>
              </div>
            )}
          </div>

          {/* Locked Range Controls (exclusively 08:55 – 18:05) */}
          {!apiFailed && (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#020b2c] border-t border-amber-300/20 text-xs text-slate-100 tabular-nums">
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? copy.pause : copy.play}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/10 text-amber-300 transition-colors cursor-pointer shrink-0"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
                ) : (
                  <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                )}
              </button>

              <span className="text-sky-200 shrink-0">
                {formatTime(currentTime)}
              </span>

              <input
                type="range"
                min={CLIP_START}
                max={CLIP_END}
                step={1}
                value={Math.max(CLIP_START, Math.min(CLIP_END, currentTime))}
                onChange={(e) => handleSeek(Number(e.target.value))}
                aria-label={copy.subtitle}
                className="w-full accent-amber-400 cursor-pointer h-1.5"
              />

              <span className="text-slate-400 shrink-0">18:05</span>

              {language === 'es' && (
                <button
                  type="button"
                  onClick={() => setShowSpanishCaptions((prev) => !prev)}
                  aria-label={copy.toggleCaptions}
                  aria-pressed={showSpanishCaptions}
                  title={copy.toggleCaptions}
                  className={`inline-flex items-center justify-center gap-1 h-9 px-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
                    showSpanishCaptions
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-300/40'
                      : 'hover:bg-white/10 text-slate-300 border border-transparent'
                  }`}
                >
                  <Captions className="w-4 h-4" aria-hidden="true" />
                  <span className="text-[11px] font-bold">
                    {copy.captionsBadge}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={handleToggleMute}
                aria-label={isMuted ? copy.unmute : copy.mute}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/10 text-slate-200 transition-colors cursor-pointer shrink-0"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-amber-300" aria-hidden="true" />
                ) : (
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleFullscreen}
                aria-label={copy.fullscreen}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/10 text-slate-200 transition-colors cursor-pointer shrink-0"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Maximize2 className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-col items-center gap-1.5">
          <p className="text-xs text-amber-200/80 tracking-wide">
            {copy.credit}
          </p>
          <p className="text-[11px] text-slate-400 break-all max-w-full px-2">
            {language === 'en' ? 'Source: ' : 'Fuente: '}
            <a
              href={NASA_SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-amber-300 transition-colors"
            >
              <span>{NASA_SOURCE_URL}</span>
              <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

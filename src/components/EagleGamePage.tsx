import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Globe,
  Rocket,
  RotateCcw,
  Sparkles,
  Star,
} from 'lucide-react';
import { CosmicBackdropWithHome } from './CosmicBackdropWithHome';
import type { LanguageCode } from '../data/storyData';
import {
  playStarApplauseSound,
  playTryAgainBooSound,
} from '../utils/applauseSound';

interface EagleGamePageProps {
  language: LanguageCode;
  onToggleLanguage: () => void;
  onBack: () => void;
  onGoHome: () => void;
  onNextToFindOnMoon: () => void;
}

type GameRound = 1 | 2;
type EaglePart = 'upper' | 'lower';
type Round2Status = 'ready' | 'launching' | 'won' | 'timeout';

const LAUNCH_COUNTDOWN_SECONDS = 10;

export function EagleGamePage({
  language,
  onToggleLanguage,
  onBack,
  onGoHome,
  onNextToFindOnMoon,
}: EagleGamePageProps) {
  const launchVideoRef = useRef<HTMLVideoElement | null>(null);

  const [round, setRound] = useState<GameRound>(1);

  // Round 1: Which part stayed on the Moon?
  const [selectedPart, setSelectedPart] = useState<EaglePart | null>(null);
  const [hoveredPart, setHoveredPart] = useState<EaglePart | null>(null);

  // Round 2: Press the yellow launch button -> video plays from second 1
  const [round2Status, setRound2Status] = useState<Round2Status>('ready');
  const [countdown, setCountdown] = useState(LAUNCH_COUNTDOWN_SECONDS);

  const [wonRounds, setWonRounds] = useState<{
    1: boolean;
    2: boolean;
  }>({
    1: false,
    2: false,
  });

  const starsWon = (wonRounds[1] ? 1 : 0) + (wonRounds[2] ? 1 : 0);

  // Countdown timer for Round 2 while waiting for the player to press the launch button
  useEffect(() => {
    if (round !== 2 || round2Status !== 'ready') return;

    if (countdown <= 0) {
      setRound2Status('timeout');
      playTryAgainBooSound();
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [round, round2Status, countdown]);

  // Reset launch video back to 0s when entering or resetting Round 2
  useEffect(() => {
    if (round !== 2) return;
    const videoEl = launchVideoRef.current;
    if (!videoEl) return;

    if (round2Status === 'ready') {
      videoEl.pause();
      try {
        videoEl.currentTime = 0;
      } catch {
        // ignore if metadata not yet loaded
      }
    }
  }, [round, round2Status]);

  const copy =
    language === 'en'
      ? {
          title: '⭐ Space Challenge 1: Eagle on the Moon!',
          question: 'Which part of Eagle stayed on the Moon?',
          instruction:
            'Tap directly on the upper or lower part of Eagle, or choose one of the two blocks!',
          back: 'Back',
          switchLabel: 'Español',
          starsLabel: 'Stars',
          upperLabel: 'Upper Part',
          upperDesc: 'Silver cabin where the astronauts rode',
          lowerLabel: 'Lower Part',
          lowerDesc: 'Golden base with the four landing legs',
          winTitle: 'You won a star!',
          winAnotherTitle: 'You won another star!',
          winBody:
            'Awesome job! The golden lower part stayed on the Moon—and it is still there today!',
          wrongTitle: 'Please try again!',
          wrongBody:
            'Almost! The silver upper part blasted back into space to bring the astronauts home. Try the other part!',
          playAgain: 'Play Again',
          nextGame: 'Next Game',
          backToGame1: 'Play from Start',

          // Round 2 (Launch Button Game)
          launchTitle: '⭐ Space Challenge 2: Blast Off from the Moon!',
          launchQuestion: 'Press the button below to launch Eagle!',
          launchInstruction:
            'Press the yellow launch button before the countdown reaches zero so Eagle blasts off back to space!',
          launchButton: 'Blast Off Now!',
          launchingBadge: 'Blasting off from the Moon...',
          countdownLabel: 'Time left',
          launchWinBody:
            '3, 2, 1… Liftoff! You launched Eagle’s upper part back into space and earned another star!',
          launchTimeoutTitle: 'Time’s up!',
          launchTimeoutBody:
            'You didn’t press the launch button in time, so you didn’t win the star. Play again and press the yellow button!',

          imageAlt:
            'Illustration of the Apollo 11 Eagle lunar module standing on the Moon, with a silver upper cabin and a golden lower landing base',
          aiDisclosure:
            'AI Disclosure: This video was created using generative AI for educational and illustrative purposes. It is not actual footage from the Apollo 11 mission.',
        }
      : {
          title: '⭐ Desafío Espacial 1: ¡El Eagle en la Luna!',
          question: '¿Qué parte del Eagle se quedó en la Luna?',
          instruction:
            '¡Toca directamente la parte superior o inferior del Eagle, o elige uno de los dos bloques!',
          back: 'Volver',
          switchLabel: 'English',
          starsLabel: 'Estrellas',
          upperLabel: 'Parte Superior',
          upperDesc: 'Cabina plateada donde viajaban los astronautas',
          lowerLabel: 'Parte Inferior',
          lowerDesc: 'Base dorada con las cuatro patas de aterrizaje',
          winTitle: '¡Ganaste una estrella!',
          winAnotherTitle: '¡Ganaste otra estrella!',
          winBody:
            '¡Excelente trabajo! La parte inferior dorada se quedó en la Luna, ¡y sigue allí hasta hoy!',
          wrongTitle: '¡Por favor, inténtalo de nuevo!',
          wrongBody:
            '¡Casi! La parte superior plateada despegó de regreso al espacio para llevar a los astronautas a casa. ¡Prueba con la otra parte!',
          playAgain: 'Jugar de nuevo',
          nextGame: 'Siguiente juego',
          backToGame1: 'Volver al primer juego',

          // Round 2 (Launch Button Game)
          launchTitle: '⭐ Desafío Espacial 2: ¡Despegue desde la Luna!',
          launchQuestion: '¡Presiona el botón de abajo para lanzar el Eagle!',
          launchInstruction:
            'Presiona el botón amarillo antes de que el conteo llegue a cero para que el Eagle despegue de regreso al espacio.',
          launchButton: '¡Despegar ahora!',
          launchingBadge: 'Despegando desde la Luna...',
          countdownLabel: 'Tiempo',
          launchWinBody:
            '¡3, 2, 1… Despegue! Encendiste el motor del Eagle a tiempo y ganaste otra estrella.',
          launchTimeoutTitle: '¡Se acabó el tiempo!',
          launchTimeoutBody:
            'No presionaste el botón a tiempo y no ganaste la estrella. ¡Juega de nuevo y presiona el botón amarillo!',

          imageAlt:
            'Ilustración del módulo lunar Eagle del Apollo 11 sobre la Luna, con su cabina superior plateada y su base inferior dorada',
          aiDisclosure:
            'Aviso sobre el uso de IA: Este video fue creado con inteligencia artificial generativa con fines educativos e ilustrativos. No corresponde a imágenes reales de la misión Apollo 11.',
        };

  function handleSelectPart(part: EaglePart) {
    if (part === 'lower' && selectedPart !== 'lower') {
      playStarApplauseSound();
      setWonRounds((prev) => (prev[1] ? prev : { ...prev, 1: true }));
    } else if (part === 'upper') {
      playTryAgainBooSound();
    }
    setSelectedPart(part);
  }

  function handlePressLaunchButton() {
    if (round2Status !== 'ready') return;

    const videoEl = launchVideoRef.current;
    setRound2Status('launching');

    if (videoEl) {
      const startAtOneSecond = () => {
        try {
          videoEl.currentTime = 1;
        } catch {
          // ignore seek failures before metadata
        }
        videoEl.play().catch(() => {
          // Fallback win if playback is blocked in a restricted environment
          setRound2Status('won');
          playStarApplauseSound();
          setWonRounds((prev) => (prev[2] ? prev : { ...prev, 2: true }));
        });
      };

      if (videoEl.readyState >= 1) {
        startAtOneSecond();
      } else {
        const onLoaded = () => {
          videoEl.removeEventListener('loadedmetadata', onLoaded);
          startAtOneSecond();
        };
        videoEl.addEventListener('loadedmetadata', onLoaded);
        videoEl.load();
      }
    }
  }

  function handleLaunchVideoEnded() {
    if (round2Status !== 'launching') return;
    setRound2Status('won');
    playStarApplauseSound();
    setWonRounds((prev) => (prev[2] ? prev : { ...prev, 2: true }));
  }

  function handleResetRound1() {
    setSelectedPart(null);
    setHoveredPart(null);
  }

  function handleResetRound2() {
    setCountdown(LAUNCH_COUNTDOWN_SECONDS);
    setRound2Status('ready');
    const videoEl = launchVideoRef.current;
    if (videoEl) {
      videoEl.pause();
      try {
        videoEl.currentTime = 0;
      } catch {
        // ignore seek errors
      }
    }
  }

  function handleGoToRound2() {
    setCountdown(LAUNCH_COUNTDOWN_SECONDS);
    setRound2Status('ready');
    setRound(2);
  }

  const isCorrect = selectedPart === 'lower';
  const isWrong = selectedPart === 'upper';

  return (
    <section className="relative w-full min-h-[100svh] bg-gradient-to-b from-[#010924] via-[#031c5e] to-[#0a63e0] flex flex-col justify-between overflow-hidden">
      <CosmicBackdropWithHome language={language} onGoHome={onGoHome} />

      {/* Top-right navigation controls + earned star counter */}
      <header className="relative z-20 w-full pl-40 pr-4 sm:pl-60 sm:pr-8 pt-4 sm:pt-6 flex flex-wrap items-center justify-end gap-2.5 sm:gap-3">
        <div
          aria-live="polite"
          className={`inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-full border backdrop-blur-md text-xs sm:text-sm font-bold transition-colors ${
            starsWon > 0
              ? 'bg-amber-400/20 border-amber-300 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
              : 'bg-[#020b2c]/65 border-white/15 text-slate-200'
          }`}
        >
          <Star
            className={`w-4 h-4 ${
              starsWon > 0 ? 'fill-amber-300 text-amber-300' : 'text-slate-300'
            }`}
            aria-hidden="true"
          />
          <span>
            {copy.starsLabel}: {starsWon}
          </span>
        </div>

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

      {/* Center Interactive Quiz Stage */}
      <div className="relative z-10 flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-center gap-4 sm:gap-6 px-4 sm:px-8 py-4 sm:py-6">
        {round === 1 && (
          <>
            <div className="text-center max-w-3xl space-y-1.5">
              <p className="font-playful font-semibold text-sm sm:text-base text-amber-300 tracking-wide">
                {copy.title}
              </p>
              <h1 className="font-playful font-semibold text-2xl sm:text-4xl md:text-5xl text-white drop-shadow-[0_4px_18px_rgba(2,11,44,0.9)] [text-wrap:balance]">
                {copy.question}
              </h1>
              <p className="text-xs sm:text-sm text-sky-100/85">
                {copy.instruction}
              </p>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
              {/* Interactive Eagle Illustration with clickable Upper & Lower blocks */}
              <div className="lg:col-span-7 flex justify-center">
                <div className="relative w-full max-w-[440px] max-h-[60svh] aspect-[1199/1312] rounded-2xl overflow-hidden border-2 border-amber-300/35 bg-[#010820] shadow-[0_24px_80px_rgba(1,8,34,0.85)]">
                  <img
                    src="/assets/aistudio/games_1_78f5f54c.png"
                    alt={copy.imageAlt}
                    className="w-full h-full object-cover select-none"
                  />

                  {/* Interactive Hotspot 1: Upper Part (Ascent Stage / Silver Cabin) */}
                  <button
                    type="button"
                    onClick={() => handleSelectPart('upper')}
                    onMouseEnter={() => setHoveredPart('upper')}
                    onMouseLeave={() => setHoveredPart(null)}
                    aria-label={copy.upperLabel}
                    aria-pressed={selectedPart === 'upper'}
                    className={`group absolute top-[12%] left-[12%] right-[12%] h-[37%] rounded-2xl border-2 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                      selectedPart === 'upper'
                        ? 'border-rose-400 bg-rose-500/20 shadow-[0_0_24px_rgba(244,63,94,0.45)]'
                        : hoveredPart === 'upper'
                          ? 'border-sky-300 bg-sky-300/15 shadow-[0_0_20px_rgba(125,211,252,0.4)]'
                          : 'border-dashed border-white/35 bg-transparent hover:border-sky-300 hover:bg-sky-300/15'
                    }`}
                  >
                    <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-[#020b2c]/85 border border-white/20 text-[11px] sm:text-xs font-playful font-semibold text-white shadow">
                      1 · {copy.upperLabel}
                    </span>
                  </button>

                  {/* Interactive Hotspot 2: Lower Part (Descent Stage / Golden Base & Legs) */}
                  <button
                    type="button"
                    onClick={() => handleSelectPart('lower')}
                    onMouseEnter={() => setHoveredPart('lower')}
                    onMouseLeave={() => setHoveredPart(null)}
                    aria-label={copy.lowerLabel}
                    aria-pressed={selectedPart === 'lower'}
                    className={`group absolute top-[49.5%] left-[7%] right-[7%] h-[35.5%] rounded-2xl border-2 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                      selectedPart === 'lower'
                        ? 'border-amber-300 bg-amber-400/20 shadow-[0_0_32px_rgba(251,191,36,0.55)]'
                        : hoveredPart === 'lower'
                          ? 'border-amber-300 bg-amber-300/15 shadow-[0_0_24px_rgba(251,191,36,0.45)]'
                          : 'border-dashed border-amber-300/55 bg-transparent hover:border-amber-300 hover:bg-amber-300/15'
                    }`}
                  >
                    <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-[#020b2c]/85 border border-amber-300/40 text-[11px] sm:text-xs font-playful font-semibold text-amber-300 shadow">
                      2 · {copy.lowerLabel}
                    </span>

                    {isCorrect && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#020b2c]/80 border-2 border-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.75)] animate-bounce">
                          <Star className="w-9 h-9 fill-amber-300 text-amber-300" />
                        </span>
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Two Main Interactive Choice Blocks + Instant Reward / Retry Feedback */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => handleSelectPart('upper')}
                  onMouseEnter={() => setHoveredPart('upper')}
                  onMouseLeave={() => setHoveredPart(null)}
                  aria-pressed={selectedPart === 'upper'}
                  className={`w-full text-left rounded-2xl border-2 p-4 sm:p-5 backdrop-blur-md transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                    selectedPart === 'upper'
                      ? 'bg-rose-950/75 border-rose-400 shadow-[0_12px_32px_rgba(244,63,94,0.28)]'
                      : hoveredPart === 'upper'
                        ? 'bg-[#051854]/90 border-sky-300'
                        : 'bg-[#020b2c]/78 hover:bg-[#051854]/88 border-sky-200/25 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-playful font-semibold text-lg sm:text-xl text-white">
                        🚀 1. {copy.upperLabel}
                      </p>
                      <p className="text-xs sm:text-sm text-sky-100/80 mt-0.5">
                        {copy.upperDesc}
                      </p>
                    </div>
                    {isWrong && (
                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-rose-500/25 border border-rose-300/40 text-xs font-bold text-rose-200">
                        ✕
                      </span>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPart('lower')}
                  onMouseEnter={() => setHoveredPart('lower')}
                  onMouseLeave={() => setHoveredPart(null)}
                  aria-pressed={selectedPart === 'lower'}
                  className={`w-full text-left rounded-2xl border-2 p-4 sm:p-5 backdrop-blur-md transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                    selectedPart === 'lower'
                      ? 'bg-amber-500/20 border-amber-300 shadow-[0_12px_36px_rgba(251,191,36,0.35)]'
                      : hoveredPart === 'lower'
                        ? 'bg-[#051854]/90 border-amber-300'
                        : 'bg-[#020b2c]/78 hover:bg-[#051854]/88 border-amber-300/35 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-playful font-semibold text-lg sm:text-xl text-amber-300">
                        🌕 2. {copy.lowerLabel}
                      </p>
                      <p className="text-xs sm:text-sm text-sky-100/85 mt-0.5">
                        {copy.lowerDesc}
                      </p>
                    </div>
                    {isCorrect && (
                      <Star
                        className="w-7 h-7 shrink-0 fill-amber-300 text-amber-300"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </button>

                {/* Feedback Panel: Star Win (with Play Again + Next Game) or Try Again */}
                {isCorrect && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="rounded-2xl bg-[#041442]/92 border-2 border-amber-300 p-4 sm:p-5 shadow-[0_16px_48px_rgba(251,191,36,0.28)] text-center space-y-3"
                  >
                    <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-[#05102e] font-playful font-bold text-sm sm:text-base shadow">
                      <Sparkles className="w-4 h-4" aria-hidden="true" />
                      <span>{copy.winTitle}</span>
                      <Star className="w-4 h-4 fill-current" aria-hidden="true" />
                    </div>
                    <p className="text-xs sm:text-sm text-sky-50 leading-relaxed">
                      {copy.winBody}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-0.5">
                      <button
                        type="button"
                        onClick={handleResetRound1}
                        className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 rounded-full bg-[#071d5c] hover:bg-[#0b2a7d] border border-amber-300/40 text-xs sm:text-sm font-semibold text-amber-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                      >
                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{copy.playAgain}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleGoToRound2}
                        className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-5 py-2 rounded-full bg-gradient-to-b from-[#ffd426] to-[#f59e0b] hover:from-[#ffe055] hover:to-[#fbbf24] text-[#05102e] text-xs sm:text-sm font-bold shadow-[0_6px_22px_rgba(245,158,11,0.4)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                      >
                        <span>{copy.nextGame}</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}

                {isWrong && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="rounded-2xl bg-rose-950/85 border-2 border-rose-400/60 p-4 sm:p-5 shadow-[0_12px_36px_rgba(244,63,94,0.22)] text-center space-y-2"
                  >
                    <p className="font-playful font-bold text-base sm:text-lg text-rose-200">
                      🛸 {copy.wrongTitle}
                    </p>
                    <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
                      {copy.wrongBody}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {round === 2 && (
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-5">
            <div className="text-center space-y-1.5">
              <p className="font-playful font-semibold text-sm sm:text-base text-amber-300 tracking-wide">
                {copy.launchTitle}
              </p>
              <h1 className="font-playful font-semibold text-2xl sm:text-4xl text-white drop-shadow-[0_4px_18px_rgba(2,11,44,0.9)] [text-wrap:balance]">
                {copy.launchQuestion}
              </h1>
              <p className="text-xs sm:text-sm text-sky-100/85 max-w-xl mx-auto">
                {copy.launchInstruction}
              </p>
            </div>

            {/* Launch Video Stage (starts paused at 0s, jumps to 1s when button pressed) */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-amber-300/40 bg-[#010820] shadow-[0_24px_80px_rgba(1,8,34,0.85)]">
              <video
                ref={launchVideoRef}
                playsInline
                preload="auto"
                onEnded={handleLaunchVideoEnded}
                className="w-full h-full object-contain bg-black"
              >
                <source
                  src="/assets/aistudio/Decollage_e61213d4.mp4"
                  type="video/mp4"
                />
              </video>

              {round2Status === 'ready' && (
                <div
                  aria-live="polite"
                  className="pointer-events-none absolute top-3 right-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#020b2c]/85 border border-amber-300/50 backdrop-blur-md text-amber-300 font-playful font-bold text-sm sm:text-base shadow-lg tabular-nums"
                >
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {copy.countdownLabel}: {countdown}s
                  </span>
                </div>
              )}

              {round2Status === 'launching' && (
                <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-[#05102e] font-playful font-bold text-xs sm:text-sm shadow-lg">
                  <Rocket className="w-4 h-4" aria-hidden="true" />
                  <span>{copy.launchingBadge}</span>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-sky-100/80 text-center max-w-2xl mx-auto leading-relaxed [text-wrap:balance]">
              {copy.aiDisclosure}
            </p>

            {/* Yellow Theme-Matching Launch Button Below the Video */}
            {round2Status === 'ready' && (
              <button
                type="button"
                onClick={handlePressLaunchButton}
                className="inline-flex items-center justify-center gap-2.5 min-h-[56px] px-8 py-3.5 rounded-full bg-gradient-to-b from-[#ffd426] via-[#fbbf24] to-[#f59e0b] hover:from-[#ffe055] hover:to-[#fbbf24] active:scale-[0.98] text-[#05102e] border-2 border-amber-200/80 font-playful font-bold text-lg sm:text-xl shadow-[0_10px_36px_rgba(245,158,11,0.5)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <Rocket className="w-6 h-6" aria-hidden="true" />
                <span>{copy.launchButton}</span>
              </button>
            )}

            {/* Won Another Star Panel (claps + Play Again + Next Game) */}
            {round2Status === 'won' && (
              <div
                role="status"
                aria-live="polite"
                className="w-full rounded-2xl bg-[#041442]/92 border-2 border-amber-300 p-5 shadow-[0_16px_48px_rgba(251,191,36,0.28)] text-center space-y-3"
              >
                <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-[#05102e] font-playful font-bold text-sm sm:text-base shadow">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>{copy.winAnotherTitle}</span>
                  <Star className="w-4 h-4 fill-current" aria-hidden="true" />
                </div>
                <p className="text-xs sm:text-sm text-sky-50 leading-relaxed max-w-xl mx-auto">
                  {copy.launchWinBody}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-0.5">
                  <button
                    type="button"
                    onClick={handleResetRound2}
                    className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 rounded-full bg-[#071d5c] hover:bg-[#0b2a7d] border border-amber-300/40 text-xs sm:text-sm font-semibold text-amber-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{copy.playAgain}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onNextToFindOnMoon}
                    className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-5 py-2 rounded-full bg-gradient-to-b from-[#ffd426] to-[#f59e0b] hover:from-[#ffe055] hover:to-[#fbbf24] text-[#05102e] text-xs sm:text-sm font-bold shadow-[0_6px_22px_rgba(245,158,11,0.4)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    <span>{copy.nextGame}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {/* Timeout / Didn't Win Star Panel (boo sound + Play Again) */}
            {round2Status === 'timeout' && (
              <div
                role="status"
                aria-live="polite"
                className="w-full rounded-2xl bg-rose-950/85 border-2 border-rose-400/60 p-5 shadow-[0_12px_36px_rgba(244,63,94,0.22)] text-center space-y-3"
              >
                <p className="font-playful font-bold text-base sm:text-lg text-rose-200">
                  🛸 {copy.launchTimeoutTitle}
                </p>
                <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed max-w-xl mx-auto">
                  {copy.launchTimeoutBody}
                </p>
                <button
                  type="button"
                  onClick={handleResetRound2}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-5 py-2 rounded-full bg-gradient-to-b from-[#ffd426] to-[#f59e0b] hover:from-[#ffe055] hover:to-[#fbbf24] text-[#05102e] text-xs sm:text-sm font-bold shadow-[0_6px_22px_rgba(245,158,11,0.35)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{copy.playAgain}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom spacer for balanced vertical centering */}
      <div aria-hidden="true" className="h-4 sm:h-6 shrink-0" />
    </section>
  );
}

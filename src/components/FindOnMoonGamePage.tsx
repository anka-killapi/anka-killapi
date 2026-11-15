import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  RotateCcw,
  Sparkles,
  Star,
} from 'lucide-react';
import { CosmicBackdropWithHome } from './CosmicBackdropWithHome';
import type { LanguageCode } from '../data/storyData';
import {
  playGentleErrorSound,
  playSingleStarSound,
  playStarApplauseSound,
} from '../utils/applauseSound';

interface FindOnMoonGamePageProps {
  language: LanguageCode;
  onToggleLanguage: () => void;
  onBack: () => void;
  onGoHome: () => void;
  onNextToNeverForgotten: () => void;
}

type MoonObjectId =
  | 'lunar_module'
  | 'retroreflector'
  | 'seismometer'
  | 'bald_eagle'
  | 'paddington'
  | 'london_bus';

interface MoonHotspot {
  id: MoonObjectId;
  correct: boolean;
  nameEn: string;
  nameEs: string;
  mysteryLabelEn: string;
  mysteryLabelEs: string;
  /** Percentage bounding box relative to 1670x942 image */
  box: {
    left: string;
    top: string;
    width: string;
    height: string;
    zIndex: number;
  };
  /** Optional extra clickable hit region for irregular silhouettes (e.g. tall arm) */
  extraBox?: {
    left: string;
    top: string;
    width: string;
    height: string;
    zIndex: number;
  };
  /** Center-anchor position for the floating name pill directly above the object */
  labelPos: {
    left: string;
    top: string;
  };
}

const MOON_HOTSPOTS: MoonHotspot[] = [
  {
    id: 'lunar_module',
    correct: true,
    nameEn: 'Eagle Lunar Module',
    nameEs: 'Módulo Lunar Eagle',
    mysteryLabelEn: 'Large golden spacecraft in the center',
    mysteryLabelEs: 'Nave dorada grande en el centro',
    box: {
      left: '24%',
      top: '8%',
      width: '52%',
      height: '45%',
      zIndex: 10,
    },
    labelPos: {
      left: '50%',
      top: '4%',
    },
  },
  {
    id: 'retroreflector',
    correct: true,
    nameEn: 'Laser Retroreflector',
    nameEs: 'Retroreflector Láser',
    mysteryLabelEn: 'Reflective mirror panel on the left',
    mysteryLabelEs: 'Panel con espejos a la izquierda',
    box: {
      left: '19.5%',
      top: '52.5%',
      width: '20.5%',
      height: '28%',
      zIndex: 20,
    },
    labelPos: {
      left: '29.5%',
      top: '47.5%',
    },
  },
  {
    id: 'seismometer',
    correct: true,
    nameEn: 'Moonquake Seismometer',
    nameEs: 'Sismómetro Lunar',
    mysteryLabelEn: 'Scientific device with blue solar panels on the right',
    mysteryLabelEs: 'Instrumento científico con paneles azules a la derecha',
    box: {
      left: '59%',
      top: '55%',
      width: '35%',
      height: '27%',
      zIndex: 20,
    },
    extraBox: {
      left: '74.5%',
      top: '39%',
      width: '6.5%',
      height: '17%',
      zIndex: 20,
    },
    labelPos: {
      left: '77%',
      top: '34.5%',
    },
  },
  {
    id: 'bald_eagle',
    correct: false,
    nameEn: 'Bald Eagle',
    nameEs: 'Águila Calva',
    mysteryLabelEn: 'Bird standing on a rock on the far left',
    mysteryLabelEs: 'Ave parada sobre una roca a la izquierda',
    box: {
      left: '3%',
      top: '33%',
      width: '19%',
      height: '39%',
      zIndex: 20,
    },
    labelPos: {
      left: '12.5%',
      top: '28%',
    },
  },
  {
    id: 'paddington',
    correct: false,
    nameEn: 'Paddington Bear',
    nameEs: 'Oso Paddington',
    mysteryLabelEn: 'Bear with a red hat in the front center',
    mysteryLabelEs: 'Oso con sombrero rojo en el centro',
    box: {
      left: '36.5%',
      top: '50.5%',
      width: '19.5%',
      height: '39.5%',
      zIndex: 20,
    },
    labelPos: {
      left: '48%',
      top: '46%',
    },
  },
  {
    id: 'london_bus',
    correct: false,
    nameEn: 'London Bus',
    nameEs: 'Autobús de Londres',
    mysteryLabelEn: 'Red double-decker bus on the far right',
    mysteryLabelEs: 'Autobús rojo de dos pisos a la derecha',
    box: {
      left: '81.5%',
      top: '34%',
      width: '16.5%',
      height: '23%',
      zIndex: 20,
    },
    labelPos: {
      left: '89.5%',
      top: '29%',
    },
  },
];

export function FindOnMoonGamePage({
  language,
  onToggleLanguage,
  onBack,
  onGoHome,
  onNextToNeverForgotten,
}: FindOnMoonGamePageProps) {
  const [clickedIds, setClickedIds] = useState<MoonObjectId[]>([]);
  const [foundIds, setFoundIds] = useState<MoonObjectId[]>([]);
  const [feedback, setFeedback] = useState<{
    type: 'found' | 'error' | 'already' | null;
    objectId?: MoonObjectId;
  }>({ type: null });

  // Sync browser document title cleanly while playing this game
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Find What Was Left on the Moon!';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const copy =
    language === 'en'
      ? {
          challengeLabel: '🚀 Space Challenge 3: Moon Detectives! 🔎🌙',
          title: '🔍 Find What Was Left on the Moon!',
          subtitle:
            'Tap the 3 real things astronauts left on the Moon. Watch out for silly surprises!',
          back: 'Back',
          switchLabel: 'Español',
          starsAria: (count: number) => `${count} of 3 stars earned`,
          oopsMessage: 'Oops! Try again!',
          foundMessage: (name: string) => `Great job! You found the ${name}!`,
          alreadyFoundMessage: (name: string) =>
            `You already earned the star for the ${name}!`,
          celebrationTitle: 'You found all 3 Moon treasures!',
          celebrationBody:
            'Amazing space explorer! The Eagle Lunar Module, the Laser Retroreflector, and the Moonquake Seismometer really stayed on the Moon!',
          playAgain: 'Play Again',
          neverForgotten: '🌕 Never Forgotten',
          sceneAlt:
            'Lunar surface scene with six objects: the Eagle Lunar Module, Laser Retroreflector, Moonquake Seismometer, Bald Eagle, Paddington Bear, and a red London Bus',
        }
      : {
          challengeLabel: '🚀 Desafío Espacial 3: ¡Detectives de la Luna! 🔎🌙',
          title: '🔍 ¡Encuentra qué se quedó en la Luna!',
          subtitle:
            'Toca las 3 cosas reales que los astronautas dejaron en la Luna. ¡Cuidado con las sorpresas divertidas!',
          back: 'Volver',
          switchLabel: 'English',
          starsAria: (count: number) => `${count} de 3 estrellas ganadas`,
          oopsMessage: '¡Ups! ¡Inténtalo de nuevo!',
          foundMessage: (name: string) => `¡Excelente! Encontraste: ${name}`,
          alreadyFoundMessage: (name: string) =>
            `¡Ya ganaste la estrella por: ${name}!`,
          celebrationTitle: '¡Encontraste los 3 tesoros lunares!',
          celebrationBody:
            '¡Increíble explorador espacial! El Módulo Lunar Eagle, el Retroreflector Láser y el Sismómetro Lunar sí se quedaron en la Luna.',
          playAgain: 'Jugar de nuevo',
          neverForgotten: '🌕 Nunca olvidados',
          sceneAlt:
            'Escena de la superficie lunar con seis objetos: Módulo Lunar Eagle, Retroreflector Láser, Sismómetro Lunar, Águila Calva, Oso Paddington y Autobús de Londres',
        };

  const starCount = foundIds.length;
  const isComplete = starCount === 3;

  function getObjectName(item: MoonHotspot): string {
    return language === 'en' ? item.nameEn : item.nameEs;
  }

  function handleHotspotClick(item: MoonHotspot) {
    // Record clicked item so its name pill renders directly above it
    setClickedIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));

    if (item.correct) {
      if (foundIds.includes(item.id)) {
        // Never award the same star twice
        setFeedback({ type: 'already', objectId: item.id });
        return;
      }

      const nextFound = [...foundIds, item.id];
      setFoundIds(nextFound);
      setFeedback({ type: 'found', objectId: item.id });

      if (nextFound.length === 3) {
        playStarApplauseSound();
      } else {
        playSingleStarSound();
      }
    } else {
      playGentleErrorSound();
      setFeedback({ type: 'error', objectId: item.id });
    }
  }

  function handlePlayAgain() {
    setClickedIds([]);
    setFoundIds([]);
    setFeedback({ type: null });
  }

  const activeFeedbackItem = feedback.objectId
    ? MOON_HOTSPOTS.find((h) => h.id === feedback.objectId)
    : undefined;

  return (
    <section className="relative w-full min-h-[100svh] bg-gradient-to-b from-[#010924] via-[#031c5e] to-[#0a63e0] flex flex-col justify-between overflow-hidden">
      <CosmicBackdropWithHome language={language} onGoHome={onGoHome} />

      {/* Top Navigation & Star Counter (0/3) */}
      <header className="relative z-20 w-full pl-40 pr-4 sm:pl-60 sm:pr-8 pt-4 sm:pt-5 flex flex-wrap items-center justify-end gap-2.5 sm:gap-3">
        <div
          role="status"
          aria-live="polite"
          aria-label={copy.starsAria(starCount)}
          className={`inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-full border backdrop-blur-md text-xs sm:text-sm font-bold transition-all ${
            starCount === 3
              ? 'bg-amber-400/25 border-amber-300 text-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.45)]'
              : starCount > 0
                ? 'bg-amber-400/15 border-amber-300/60 text-amber-200'
                : 'bg-[#020b2c]/70 border-white/15 text-slate-200'
          }`}
        >
          <span className="inline-flex items-center gap-1" aria-hidden="true">
            {[0, 1, 2].map((slot) => (
              <Star
                key={slot}
                className={`w-4 h-4 transition-all duration-200 ${
                  slot < starCount
                    ? 'fill-amber-300 text-amber-300 scale-110'
                    : 'text-slate-400/70'
                }`}
              />
            ))}
          </span>
          <span className="tabular-nums font-playful">{starCount}/3</span>
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

      {/* Center Game Stage */}
      <div className="relative z-10 flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-center gap-3 sm:gap-4 px-3 sm:px-6 py-3 sm:py-5">
        <div className="text-center max-w-3xl space-y-1.5">
          <p className="font-playful font-semibold text-sm sm:text-base text-amber-300 tracking-wide">
            {copy.challengeLabel}
          </p>
          <h1 className="font-playful font-semibold text-2xl sm:text-4xl md:text-5xl text-white drop-shadow-[0_4px_18px_rgba(2,11,44,0.9)] [text-wrap:balance]">
            {copy.title}
          </h1>
          <p className="text-xs sm:text-sm text-sky-100/85 max-w-2xl mx-auto">
            {copy.subtitle}
          </p>
        </div>

        {/* Fixed-height Feedback Strip ("Oops! Try again!" or Found confirmation) */}
        <div className="min-h-[40px] flex items-center justify-center">
          {feedback.type === 'error' && (
            <div
              role="status"
              aria-live="polite"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/90 border border-rose-400/70 text-rose-100 font-playful font-semibold text-sm sm:text-base shadow-lg"
            >
              <span>🛸 {copy.oopsMessage}</span>
            </div>
          )}

          {feedback.type === 'found' && activeFeedbackItem && !isComplete && (
            <div
              role="status"
              aria-live="polite"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#051854]/90 border border-amber-300 text-amber-200 font-playful font-semibold text-sm sm:text-base shadow-lg"
            >
              <Star
                className="w-4 h-4 fill-amber-300 text-amber-300"
                aria-hidden="true"
              />
              <span>{copy.foundMessage(getObjectName(activeFeedbackItem))}</span>
            </div>
          )}

          {feedback.type === 'already' && activeFeedbackItem && !isComplete && (
            <div
              role="status"
              aria-live="polite"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#020b2c]/85 border border-amber-300/45 text-sky-100 font-playful font-medium text-xs sm:text-sm shadow-lg"
            >
              <span>
                ⭐ {copy.alreadyFoundMessage(getObjectName(activeFeedbackItem))}
              </span>
            </div>
          )}
        </div>

        {/* Supplied Lunar Scene Image with 6 Invisible Clickable Hotspots */}
        <div className="relative w-full max-w-4xl aspect-[1670/942] rounded-2xl overflow-hidden border-2 border-amber-300/35 bg-[#010820] shadow-[0_24px_80px_rgba(1,8,34,0.88)]">
          <img
            src="/assets/aistudio/final_game_ec1902ae.png"
            alt={copy.sceneAlt}
            className="w-full h-full object-cover select-none"
          />

          {MOON_HOTSPOTS.map((item) => {
            const isClicked = clickedIds.includes(item.id);
            const isFound = foundIds.includes(item.id);
            const displayName = getObjectName(item);
            const mysteryLabel =
              language === 'en' ? item.mysteryLabelEn : item.mysteryLabelEs;

            return (
              <div key={item.id}>
                {/* Primary Invisible Hotspot Button */}
                <button
                  type="button"
                  onClick={() => handleHotspotClick(item)}
                  aria-label={isClicked ? displayName : mysteryLabel}
                  aria-pressed={isClicked}
                  style={{
                    left: item.box.left,
                    top: item.box.top,
                    width: item.box.width,
                    height: item.box.height,
                    zIndex: item.box.zIndex,
                  }}
                  className="absolute bg-transparent border-0 rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:bg-amber-300/10"
                />

                {/* Optional Extra Hit Box (non-tabbable, e.g. Seismometer upper arm) */}
                {item.extraBox && (
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={() => handleHotspotClick(item)}
                    style={{
                      left: item.extraBox.left,
                      top: item.extraBox.top,
                      width: item.extraBox.width,
                      height: item.extraBox.height,
                      zIndex: item.extraBox.zIndex,
                    }}
                    className="absolute bg-transparent border-0 cursor-pointer"
                  />
                )}

                {/* Floating Name Label Displayed Directly Above Clicked Object */}
                {isClicked && (
                  <div
                    style={{
                      left: item.labelPos.left,
                      top: item.labelPos.top,
                      zIndex: 30,
                    }}
                    className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap"
                  >
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full border backdrop-blur-md font-playful font-semibold text-[11px] sm:text-sm shadow-[0_4px_16px_rgba(0,0,0,0.75)] ${
                        isFound
                          ? 'bg-[#041442]/92 border-amber-300 text-amber-300'
                          : 'bg-rose-950/90 border-rose-300/60 text-rose-100'
                      }`}
                    >
                      {isFound && (
                        <Star
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-300 text-amber-300 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <span>{displayName}</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* 3/3 Victory Celebration Card */}
          {isComplete && (
            <div
              role="dialog"
              aria-modal="false"
              aria-labelledby="moon-find-win-heading"
              className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-[#01071a]/65 backdrop-blur-[2px]"
            >
              <div className="w-full max-w-md rounded-2xl bg-[#041033]/95 border-2 border-amber-300 shadow-[0_24px_80px_rgba(251,191,36,0.35)] p-5 sm:p-7 text-center space-y-3.5">
                <div
                  className="flex items-center justify-center gap-2.5"
                  aria-hidden="true"
                >
                  {[0, 1, 2].map((idx) => (
                    <Star
                      key={idx}
                      className="w-9 h-9 sm:w-11 sm:h-11 fill-amber-300 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.85)] animate-bounce"
                      style={{ animationDelay: `${idx * 120}ms` }}
                    />
                  ))}
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/60 text-amber-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>3/3</span>
                </div>

                <h2
                  id="moon-find-win-heading"
                  className="font-playful font-semibold text-xl sm:text-2xl text-amber-300 [text-wrap:balance]"
                >
                  {copy.celebrationTitle}
                </h2>

                <p className="text-xs sm:text-sm text-sky-50 leading-relaxed">
                  {copy.celebrationBody}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handlePlayAgain}
                    className="inline-flex items-center justify-center gap-1.5 min-h-[46px] px-5 py-2.5 rounded-full bg-[#071d5c] hover:bg-[#0b2a7d] border border-amber-300/40 text-xs sm:text-sm font-semibold text-amber-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    <span>{copy.playAgain}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onNextToNeverForgotten}
                    className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-2.5 rounded-full bg-gradient-to-b from-[#ffd426] to-[#f59e0b] hover:from-[#ffe055] hover:to-[#fbbf24] text-[#05102e] font-playful font-bold text-sm sm:text-base shadow-[0_8px_28px_rgba(245,158,11,0.45)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    <span>{copy.neverForgotten}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom spacer */}
      <div aria-hidden="true" className="h-3 sm:h-5 shrink-0" />
    </section>
  );
}

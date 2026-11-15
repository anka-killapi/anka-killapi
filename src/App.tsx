/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AdventurePage } from './components/AdventurePage';
import { EagleGamePage } from './components/EagleGamePage';
import { EagleSpaceshipPage } from './components/EagleSpaceshipPage';
import { FindOnMoonGamePage } from './components/FindOnMoonGamePage';
import { HeroLanding } from './components/HeroLanding';
import { MoonArtifactsPage } from './components/MoonArtifactsPage';
import { NeverForgottenPage } from './components/NeverForgottenPage';
import type { LanguageCode } from './data/storyData';

type PageView =
  | 'landing'
  | 'adventure'
  | 'eagle-explorer'
  | 'moon-artifacts'
  | 'find-on-moon'
  | 'never-forgotten'
  | 'eagle-game';

function getPageFromHash(): PageView {
  if (typeof window === 'undefined') return 'landing';
  if (window.location.hash === '#never-forgotten') return 'never-forgotten';
  if (window.location.hash === '#find-on-moon') return 'find-on-moon';
  if (window.location.hash === '#eagle-game') return 'eagle-game';
  if (window.location.hash === '#what-else-on-moon') return 'moon-artifacts';
  if (window.location.hash === '#eagle-explorer') return 'eagle-explorer';
  if (window.location.hash === '#adventure') return 'adventure';
  return 'landing';
}

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>('es');
  const [page, setPage] = useState<PageView>(getPageFromHash);
  const [findReturnPage, setFindReturnPage] = useState<
    'moon-artifacts' | 'eagle-game'
  >('eagle-game');

  useEffect(() => {
    function handleHashChange() {
      setPage(getPageFromHash());
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  function navigateTo(nextPage: PageView) {
    setPage(nextPage);
    if (typeof window !== 'undefined') {
      const targetHash =
        nextPage === 'never-forgotten'
          ? '#never-forgotten'
          : nextPage === 'find-on-moon'
            ? '#find-on-moon'
            : nextPage === 'eagle-game'
              ? '#eagle-game'
              : nextPage === 'moon-artifacts'
                ? '#what-else-on-moon'
                : nextPage === 'eagle-explorer'
                  ? '#eagle-explorer'
                  : nextPage === 'adventure'
                    ? '#adventure'
                    : '#top';
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
      }
    }
  }

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));

  const goHome = () => {
    navigateTo('landing');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-[#020b2c] text-slate-100 selection:bg-amber-400 selection:text-[#020b2c]">
      <main>
        {page === 'landing' && (
          <HeroLanding
            language={language}
            onToggleLanguage={toggleLanguage}
            onOpenPrologue={() => navigateTo('adventure')}
          />
        )}

        {page === 'adventure' && (
          <AdventurePage
            language={language}
            onToggleLanguage={toggleLanguage}
            onBack={() => navigateTo('landing')}
            onGoHome={goHome}
            onExploreEagle={() => navigateTo('eagle-explorer')}
          />
        )}

        {page === 'eagle-explorer' && (
          <EagleSpaceshipPage
            language={language}
            onToggleLanguage={toggleLanguage}
            onBack={() => navigateTo('adventure')}
            onGoHome={goHome}
            onExploreMoonArtifacts={() => navigateTo('moon-artifacts')}
          />
        )}

        {page === 'moon-artifacts' && (
          <MoonArtifactsPage
            language={language}
            onToggleLanguage={toggleLanguage}
            onBack={() => navigateTo('eagle-explorer')}
            onGoHome={goHome}
            onPlayGames={() => navigateTo('eagle-game')}
          />
        )}

        {page === 'find-on-moon' && (
          <FindOnMoonGamePage
            language={language}
            onToggleLanguage={toggleLanguage}
            onBack={() => navigateTo(findReturnPage)}
            onGoHome={goHome}
            onNextToNeverForgotten={() => navigateTo('never-forgotten')}
          />
        )}

        {page === 'never-forgotten' && (
          <NeverForgottenPage
            language={language}
            onToggleLanguage={toggleLanguage}
            onBack={() => navigateTo('find-on-moon')}
            onGoHome={goHome}
          />
        )}

        {page === 'eagle-game' && (
          <EagleGamePage
            language={language}
            onToggleLanguage={toggleLanguage}
            onBack={() => navigateTo('moon-artifacts')}
            onGoHome={goHome}
            onNextToFindOnMoon={() => {
              setFindReturnPage('eagle-game');
              navigateTo('find-on-moon');
            }}
          />
        )}
      </main>
    </div>
  );
}

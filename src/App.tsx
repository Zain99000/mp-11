/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BackgroundVideo } from './components/BackgroundVideo';
import { Navigation } from './components/Navigation';
import { HeroContent } from './components/HeroContent';
import { ManifestoModal } from './components/ManifestoModal';
import { InfoModal } from './components/InfoModal';

export default function App() {
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Dark mode support with system preference detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      // The app has a dark cinematic aesthetic, ensuring the dark class is active
      document.documentElement.classList.add('dark');
    };

    updateTheme();
    try {
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    } catch {
      // Fallback for older browsers
      mediaQuery.addListener(updateTheme);
      return () => mediaQuery.removeListener(updateTheme);
    }
  }, []);

  return (
    <div
      id="asme-app"
      className="min-h-screen bg-black overflow-hidden relative flex flex-col justify-between selection:bg-white/20 selection:text-white"
    >
      {/* Full-screen looping background video with custom JS fade system */}
      <BackgroundVideo />

      {/* Navigation bar */}
      <Navigation
        onSelectSection={(section) => setActiveSection(section)}
      />

      {/* Hero content area */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <HeroContent onOpenManifesto={() => setIsManifestoOpen(true)} />
      </main>

      {/* Interactive modals */}
      <ManifestoModal
        isOpen={isManifestoOpen}
        onClose={() => setIsManifestoOpen(false)}
      />

      <InfoModal
        section={activeSection}
        onClose={() => setActiveSection(null)}
      />
    </div>
  );
}

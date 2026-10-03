import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroContentProps {
  onOpenManifesto: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({ onOpenManifesto }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  // Allow BCET / Bengal College or empty input (quick enter) to load CampusFlow
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = value.trim().toLowerCase();
    if (
      !normalized ||
      normalized === 'bcet' ||
      normalized === 'bengal college of engineering and technology' ||
      normalized.includes('bcet') ||
      normalized.includes('bengal college') ||
      normalized.includes('campusflow')
    ) {
      setError('');
      window.location.assign(`${import.meta.env.BASE_URL}campus/`);
    } else {
      setError('Sorry, college not found. Try "BCET".');
    }
  };

  return (
    <section
      id="hero-section"
      className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[10%] md:-translate-y-[20%]"
      aria-label="Hero section"
    >
      {/* Main Heading */}
      <h1
        id="hero-heading"
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Engineering college automation & scheduling system
      </h1>

      {/* Hero container */}
      <div className="max-w-xl w-full space-y-4">
        {/* Email input bar */}
        <form
          id="newsletter-form"
          onSubmit={handleSubmit}
          noValidate
          className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3 transition-all hover:bg-white/[0.03]"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Enter your college
          </label>
          <input
            id="newsletter-email"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter your college (e.g. BCET)"
            aria-label="Enter your college"
            className="bg-transparent flex-1 outline-none text-white placeholder:text-white/40 text-base min-w-0"
          />

          <button
            id="newsletter-submit-btn"
            type="submit"
            aria-label="Open CampusFlow"
            className="bg-white rounded-full p-3 text-black hover:bg-white/90 transition-all hover:scale-105 active:scale-95 flex items-center justify-center flex-shrink-0 cursor-pointer shadow-lg"
          >
            <ArrowRight size={20} />
          </button>
        </form>

        {error && (
          <div className="text-xs text-rose-300 bg-rose-950/50 border border-rose-500/30 rounded-full py-1.5 px-4 inline-flex items-center gap-1.5 animate-fadeIn">
            <span>{error}</span>
          </div>
        )}

        {/* Manifesto button */}
        <div className="pt-2 flex justify-center">
          <button
            id="manifesto-button"
            type="button"
            onClick={onOpenManifesto}
            className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            Read Manifesto
          </button>
        </div>
      </div>
    </section>
  );
};

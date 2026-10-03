import React, { useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';

interface NavigationProps {
  onOpenLogin?: () => void;
  onOpenSignUp?: () => void;
  onSelectSection: (section: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onSelectSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-20 pl-6 pr-6 py-6">
      <div
        id="navbar-container"
        className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto"
      >
        {/* Left side: Logo and Navigation Links */}
        <div className="flex items-center gap-8">
          <a
            id="logo-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectSection('home');
            }}
            className="flex items-center gap-2 text-white font-semibold text-lg tracking-tight hover:opacity-90 transition-opacity"
            aria-label="Asme home"
          >
            <Globe size={24} className="text-white animate-spin-slow" />
            <span>Asme</span>
          </a>

          {/* Nav links next to the logo with gap-8, hidden on mobile, shown on md: */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            <button
              id="nav-link-features"
              onClick={() => onSelectSection('features')}
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              Features
            </button>
            <button
              id="nav-link-about"
              onClick={() => onSelectSection('about')}
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              About
            </button>
          </nav>
        </div>

        {/* Right side: Mobile menu toggle button */}
        <div className="flex items-center gap-4">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden mt-3 max-w-5xl mx-auto liquid-glass rounded-2xl p-6 flex flex-col space-y-4 border border-white/10 bg-black/80 animate-in fade-in slide-in-from-top-2"
        >
          <button
            id="mobile-link-features"
            onClick={() => {
              onSelectSection('features');
              setMobileMenuOpen(false);
            }}
            className="text-left text-white/80 hover:text-white py-2 text-base font-medium transition-colors"
          >
            Features
          </button>
          <button
            id="mobile-link-about"
            onClick={() => {
              onSelectSection('about');
              setMobileMenuOpen(false);
            }}
            className="text-left text-white/80 hover:text-white py-2 text-base font-medium transition-colors"
          >
            About
          </button>
        </div>
      )}
    </header>
  );
};

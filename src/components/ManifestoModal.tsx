import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface ManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManifestoModal: React.FC<ManifestoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="manifesto-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="manifesto-title"
    >
      <div
        id="manifesto-card"
        className="liquid-glass rounded-2xl max-w-lg w-full p-8 text-white relative shadow-2xl border border-white/10 bg-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-manifesto-btn"
          onClick={onClose}
          aria-label="Close manifesto modal"
          className="absolute top-5 right-5 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-white/80 mb-4 text-xs font-semibold tracking-wider uppercase">
          <Sparkles size={16} />
          <span>The Manifesto</span>
        </div>

        <h2
          id="manifesto-title"
          className="text-3xl text-white mb-6 font-normal tracking-tight"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Built for Engineering college automation & scheduling system
        </h2>

        <div className="space-y-4 text-white/80 text-sm leading-relaxed font-light">
          <p>
Our **Engineering College Automation and Scheduling System** aims to make college management smarter, faster, and more organized. The platform brings **students, faculty, departments, and administrators** together in one digital system. It simplifies **class scheduling, attendance tracking, student records, faculty management, branch information, and academic planning**. By reducing manual paperwork and avoiding scheduling conflicts, the system saves time and improves efficiency. 

          </p>
          <p>
           Our goal is to create a **transparent, user-friendly, and interactive platform** that helps colleges manage daily academic activities effectively. Through automation and centralized information, CampusFlow supports a more connected, productive, and technology-driven campus environment.
          </p>
          <p className="italic text-white/90">
            &ldquo;Curiosity is the engine of human evolution. Stay relentlessly curious.&rdquo;
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
          <button
            id="acknowledge-manifesto-btn"
            onClick={onClose}
            className="liquid-glass rounded-full px-6 py-2.5 text-white text-xs font-medium hover:bg-white/10 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Layers, CreditCard, Compass } from 'lucide-react';

interface InfoModalProps {
  section: string | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ section, onClose }) => {
  if (!section || section === 'home') return null;

  const getContent = () => {
    switch (section) {
      case 'features':
        return {
          icon: <Layers size={20} className="text-white" />,
          title: 'Crafted Capabilities',
          subtitle: 'Designed to elevate your exploration of your college.',
          items: [
            {
              title: 'Dynamic Synthesis',
              desc: 'Condense dense documents and datasets into crystal-clear UI.',
            },
            {
              title: 'Adaptive Visual Canvas',
              desc: 'Seamlessly transition between college schedules, programs and faculty.',
            },
            {
              title: 'Sub-second Latency',
              desc: 'Engineered at the edge for frictionless interaction without distraction or delay.',
            },
          ],
        };

      case 'pricing':
        return {
          icon: <CreditCard size={20} className="text-white" />,
          title: 'Campus Automation Plans',
          subtitle: 'Flexible tiers for institutions of every scale.',
          items: [
            {
              title: 'Starter Campus',
              desc: 'Ideal for single departments or colleges up to 1,000 enrolled students.',
            },
            {
              title: 'Institution Pro',
              desc: 'Comprehensive scheduling, real-time attendance, and complete academic records.',
            },
            {
              title: 'University Enterprise',
              desc: 'Multi-campus deployment with custom API integrations and dedicated support.',
            },
          ],
        };
      
      case 'about':
        return {
          icon: <Compass size={20} className="text-white" />,
          title: 'About Asme',
          subtitle: 'Bridging college automation and modern intelligence.',
          items: [
            {
              title: 'Our Mission',
              desc: 'To build intuitive digital tools that honor the user’s cognitive flow and aesthetic senses.',
            },
            {
              title: 'Craft Philosophy',
              desc: 'Every border, gradient, and timing function is calibrated for quiet elegance and focused browsing.',
            },
            {
              title: 'Global Community',
              desc: 'Thousands of students, teachers and faculty rely on Asme daily.',
            },
          ],
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  return (
    <div
      id="info-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
    >
      <div
        id="info-card"
        className="liquid-glass rounded-2xl max-w-lg w-full p-8 text-white relative shadow-2xl border border-white/10 bg-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-info-modal-btn"
          onClick={onClose}
          aria-label="Close information modal"
          className="absolute top-5 right-5 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-white/80 mb-3 text-xs font-semibold tracking-wider uppercase">
          {content.icon}
          <span>{section}</span>
        </div>

        <h2
          id="info-modal-title"
          className="text-3xl text-white mb-2 font-normal tracking-tight"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {content.title}
        </h2>
        <p className="text-white/60 text-xs mb-6">{content.subtitle}</p>

        <div className="space-y-4">
          {content.items.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
            >
              <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-white/70 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            id="close-info-btn"
            onClick={onClose}
            className="liquid-glass rounded-full px-6 py-2 text-white text-xs font-medium hover:bg-white/10 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

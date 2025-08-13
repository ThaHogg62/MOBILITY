
import React from 'react';

interface HeroProps {
  onGetStartedClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStartedClick }) => {
  return (
    <section className="relative py-20 md:py-32 bg-grid-pattern overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-4 leading-tight">
          Your Studio. Anywhere.
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Experience the power of a professional recording studio, right in your pocket.
          Drag, drop, record, and mix with an intuitive interface designed for creators on the move.
        </p>
        <button
          onClick={onGetStartedClick}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-500 transition-transform transform hover:scale-105 shadow-2xl shadow-blue-600/30"
        >
          Get Started For Free
        </button>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end justify-center space-x-1 sm:space-x-2 h-24 opacity-50 z-0">
          <div className="w-3 sm:w-4 bar"></div>
          <div className="w-3 sm:w-4 bar"></div>
          <div className="w-3 sm:w-4 bar"></div>
          <div className="w-3 sm:w-4 bar"></div>
          <div className="w-3 sm:w-4 bar"></div>
          <div className="w-3 sm:w-4 bar hidden sm:block"></div>
          <div className="w-3 sm:w-4 bar hidden sm:block"></div>
      </div>
      <style>{`
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(10, 10, 10, 0.98), rgba(10, 10, 10, 0.98)), 
                            radial-gradient(circle at center, #1e3a8a 1px, transparent 1px);
          background-size: 100%, 30px 30px;
        }
        .bar { 
            background: linear-gradient(to top, #22c55e 60%, #facc15 85%, #ef4444 100%);
            animation: wave 1.8s infinite ease-in-out; 
        }
        .bar:nth-child(1) { animation-delay: -0.6s; }
        .bar:nth-child(2) { animation-delay: -0.5s; }
        .bar:nth-child(3) { animation-delay: -0.4s; }
        .bar:nth-child(4) { animation-delay: -0.3s; }
        .bar:nth-child(5) { animation-delay: -0.2s; }
        .bar:nth-child(6) { animation-delay: -0.1s; }
        .bar:nth-child(7) { animation-delay: 0s; }
        @keyframes wave {
            0%, 50%, 100% { height: 0.5rem; }
            10% { height: 3rem; }
            25% { height: 6rem; }
            40% { height: 2.5rem; }
        }
      `}</style>
    </section>
  );
};

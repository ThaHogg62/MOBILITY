
import React from 'react';
import { SubscriptionTier } from '../types';
import { Pricing } from './Pricing';
import { CloseIcon } from './icons';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribeClick: (tier: SubscriptionTier) => void;
  currentTier: SubscriptionTier;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onSubscribeClick, currentTier }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="relative bg-gray-900 border border-blue-500/30 rounded-lg shadow-2xl w-full max-w-7xl m-4 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-2 bg-gray-800 rounded-full"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        <Pricing onSubscribeClick={onSubscribeClick} currentTier={currentTier} />
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale { animation: fade-in-scale 0.3s forwards ease-out; }
      `}</style>
    </div>
  );
};

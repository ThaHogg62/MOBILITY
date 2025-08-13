
import React from 'react';
import { PREMIUM_PRICE, EXCLUSIVE_PRICE, FREE_TRACK_LIMIT, PREMIUM_TRACK_LIMIT, EXCLUSIVE_TRACK_LIMIT } from '../constants';
import { SubscriptionTier } from '../types';
import { EQIcon, MagicIcon, GridIcon } from './icons';

interface PricingProps {
  onSubscribeClick: (tier: SubscriptionTier) => void;
  currentTier: SubscriptionTier;
}

const CheckIcon = () => (
    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
);

const PlanFeature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <CheckIcon />
        <span className="ml-3 text-gray-300">{children}</span>
    </li>
);

export const Pricing: React.FC<PricingProps> = ({ onSubscribeClick, currentTier }) => {
  const isPremium = currentTier === SubscriptionTier.Premium;
  const isExclusive = currentTier === SubscriptionTier.Exclusive;

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl md:text-4xl font-orbitron font-bold text-center text-white mb-12">
          Choose Your Plan
        </h3>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="group bg-gray-800 border border-gray-700 rounded-lg p-8 flex flex-col transition-all duration-300 hover:border-gray-500 hover:shadow-2xl">
            <h4 className="text-2xl font-bold text-white mb-2">Free</h4>
            <p className="text-gray-400 mb-6">Perfect for starting out.</p>
            <p className="text-4xl font-bold text-white mb-6">$0<span className="text-lg text-gray-400"> / forever</span></p>
            <ul className="space-y-4 mb-8">
                <PlanFeature>{FREE_TRACK_LIMIT} Audio Tracks</PlanFeature>
                <PlanFeature>Drag & Drop Interface</PlanFeature>
                <PlanFeature>Save to Device (WAV)</PlanFeature>
            </ul>
             <button disabled className="w-full mt-auto bg-gray-700 text-white font-bold py-3 px-8 rounded-lg text-lg cursor-default">
                {currentTier === SubscriptionTier.Free ? 'Your Current Plan' : 'Included in your plan'}
            </button>
          </div>

          {/* Premium Tier */}
          <div className="group bg-gray-800 border border-blue-500/50 rounded-lg p-8 flex flex-col relative overflow-hidden transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-600/20">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">POPULAR</div>
            <h4 className="text-2xl font-bold text-blue-400 mb-2">Premium</h4>
            <p className="text-gray-400 mb-6">For producers ready to level up.</p>
            <p className="text-4xl font-bold text-white mb-6">${PREMIUM_PRICE}<span className="text-lg text-gray-400"> / one-time</span></p>
            <ul className="space-y-4 mb-8">
               <PlanFeature>{PREMIUM_TRACK_LIMIT} Audio Tracks</PlanFeature>
               <PlanFeature>Real-time Vocal Preset</PlanFeature>
               <PlanFeature>AI Creative Assistant</PlanFeature>
               <PlanFeature>AI Sample Generator</PlanFeature>
               <PlanFeature>Full Sample Library</PlanFeature>
            </ul>
            <button 
              onClick={() => onSubscribeClick(SubscriptionTier.Premium)} 
              disabled={isPremium || isExclusive}
              className="w-full mt-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors hover:bg-blue-500 shadow-lg shadow-blue-600/30 disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
                {isPremium ? 'Your Current Plan' : isExclusive ? 'Included in your plan' : 'Go Premium'}
            </button>
          </div>
          
          {/* Exclusive Tier */}
          <div className="group bg-gradient-to-br from-blue-900 via-gray-900 to-gray-900 border-2 border-yellow-400 rounded-lg p-8 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/20 scale-100 lg:scale-105">
            <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-4 py-1 rounded-bl-lg">BEST VALUE</div>
            <h4 className="text-2xl font-bold text-yellow-400 mb-2">Exclusive</h4>
            <p className="text-gray-400 mb-6">The ultimate production suite.</p>
            <p className="text-4xl font-bold text-white mb-6">${EXCLUSIVE_PRICE}<span className="text-lg text-gray-400"> / one-time</span></p>
            <ul className="space-y-4 mb-8">
               <PlanFeature>All Premium Features</PlanFeature>
               <PlanFeature><span className="font-bold text-yellow-300">{EXCLUSIVE_TRACK_LIMIT}</span> Audio Tracks</PlanFeature>
               <PlanFeature>
                    <span className="flex items-center">
                        <GridIcon className="w-5 h-5 mr-2 text-yellow-400"/> Tha Tracc Master MPC
                    </span>
                </PlanFeature>
                <PlanFeature>
                    <span className="flex items-center">
                         <MagicIcon className="w-5 h-5 mr-2 text-yellow-400"/> AI Beat Generator
                    </span>
               </PlanFeature>
            </ul>
            <button 
              onClick={() => onSubscribeClick(SubscriptionTier.Exclusive)}
              disabled={isExclusive}
              className="w-full mt-auto bg-yellow-400 text-black font-bold py-3 px-8 rounded-lg text-lg transition-colors hover:bg-yellow-300 shadow-lg shadow-yellow-400/30 disabled:bg-gray-700 disabled:text-white disabled:cursor-not-allowed"
            >
                {isExclusive ? 'Your Current Plan' : 'Go Exclusive'}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
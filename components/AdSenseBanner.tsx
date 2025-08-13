
import React, { useEffect } from 'react';
import { User, SubscriptionTier } from '../types';

interface AdSenseBannerProps {
  user: User;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({ user }) => {
  // Only show ads for Free tier users
  if (user.subscriptionTier !== SubscriptionTier.Free) {
    return null;
  }

  useEffect(() => {
    try {
      // This is necessary for single-page applications to re-initialize ads on view changes.
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-[70px] bg-gray-800 border-t border-gray-700 flex items-center justify-center z-40">
      <div className="text-center w-full">
        {/* 
          =================================================================================
          IMPORTANT: ACTION REQUIRED
          =================================================================================
          To enable ads, you MUST replace the following two placeholder values:
          1. data-ad-client: Replace 'ca-pub-XXXXXXXXXXXXXXXX' with your own AdSense Publisher ID.
          2. data-ad-slot: Replace 'YYYYYYYYYY' with your own Ad Unit's Slot ID.
          You can get these from your Google AdSense account.
          =================================================================================
        */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // <-- REPLACE
          data-ad-slot="YYYYYYYYYY" // <-- REPLACE
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <p className="text-xs text-gray-500 absolute top-0 right-2">Advertisement</p>
      </div>
    </div>
  );
};
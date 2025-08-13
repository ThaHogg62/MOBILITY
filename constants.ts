
import { SubscriptionTier } from './types';

export const PREMIUM_PRICE = 15;
export const EXCLUSIVE_PRICE = 30;

export const FREE_TRACK_LIMIT = 4;
export const PREMIUM_TRACK_LIMIT = 10;
export const EXCLUSIVE_TRACK_LIMIT = 24;


export const TRACK_LIMITS = {
  [SubscriptionTier.Free]: FREE_TRACK_LIMIT,
  [SubscriptionTier.Premium]: PREMIUM_TRACK_LIMIT,
  [SubscriptionTier.Exclusive]: EXCLUSIVE_TRACK_LIMIT,
};

export const TIER_PRICES = {
    [SubscriptionTier.Premium]: PREMIUM_PRICE,
    [SubscriptionTier.Exclusive]: EXCLUSIVE_PRICE,
}

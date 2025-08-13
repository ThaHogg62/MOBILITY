
export enum SubscriptionTier {
  Free = 'Free',
  Premium = 'Premium',
  Exclusive = 'Exclusive',
}

export interface User {
  uid: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  subscriptionTier: SubscriptionTier;
}

export interface Track {
  id: number;
  name:string;
  isMuted: boolean;
  isSolo: boolean;
  isArmed: boolean;
  useVocalPreset: boolean;
  audioUrl?: string; // URL for recorded audio blob
  beatSequence?: AiBeatSequence | null;
}

export interface Project {
    tracks: Track[];
}

export interface MixerState {
  volume: number; // 0-100
  pan: number; // -100 (L) to 100 (R)
}

// New types for Sample Library
export interface Sample {
  id: string;
  name: string;
  type: 'kick' | 'snare' | 'hihat' | 'melody' | 'bass' | 'open-hat' | 'clap' | 'tom';
}

export interface SamplePack {
  id: string;
  name: string;
  description: string;
  samples: Sample[];
}

// New type for AI Generated Sample
export interface AiGeneratedSample {
    name: string;
    description: string;
}

// New type for AI Beat Sequence
export type AiBeatSequence = string[];

// New type for Toast Notifications
export interface ToastNotification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

// App view state
export type AppView = 'app' | 'payment' | 'upgrade';
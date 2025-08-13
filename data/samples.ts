
import { SamplePack } from '../types';

export const samplePacks: SamplePack[] = [
  {
    id: 'trap-essentials-1',
    name: 'Trap Essentials Vol. 1',
    description: 'Hard-hitting drums and bass for modern trap.',
    samples: [
      { id: 'tk1', name: '808 Kick - "Rumble"', type: 'kick' },
      { id: 'ts1', name: 'Snare - "Crack"', type: 'snare' },
      { id: 'th1', name: 'Hi-hat - "Triplet"', type: 'hihat' },
      { id: 'tb1', name: 'Bass - "Sub Zero"', type: 'bass' },
    ],
  },
  {
    id: 'lofi-dreams-1',
    name: 'Lofi Dreams Vol. 1',
    description: 'Dusty chords and chill beats for relaxing.',
    samples: [
      { id: 'lk1', name: 'Kick - "Thump"', type: 'kick' },
      { id: 'ls1', name: 'Snare - "Brush"', type: 'snare' },
      { id: 'lm1', name: 'Melody - "Piano Mood"', type: 'melody' },
      { id: 'lm2', name: 'Melody - "Guitar Haze"', type: 'melody' },
    ],
  },
    {
    id: 'house-foundations-1',
    name: 'House Foundations',
    description: 'Classic four-on-the-floor rhythms.',
    samples: [
      { id: 'hk1', name: 'Kick - "Deep House"', type: 'kick' },
      { id: 'hh1', name: 'Open Hat - "Sizzle"', type: 'hihat' },
      { id: 'hm1', name: 'Melody - "Synth Stab"', type: 'melody' },
      { id: 'hb1', name: 'Bass - "Funky Groove"', type: 'bass' },
    ],
  },
];


import React, { useState, useEffect } from 'react';
import { samplePacks } from '../data/samples';
import { Sample, SamplePack, AiBeatSequence } from '../types';
import { generateBeatSequence } from '../services/geminiService';
import { MagicIcon } from './icons';
import { AudioEngine } from '../services/audioEngine';
import { useToast } from '../contexts/ToastContext';

const DrumPad: React.FC<{ sample: Sample; onPadClick: (sampleId: string) => void; isActive: boolean; }> = ({ sample, onPadClick, isActive }) => {
    return (
        <button
            onClick={() => onPadClick(sample.id)}
            className={`w-full aspect-square rounded-lg flex items-center justify-center p-2 text-center transition-all duration-150 ease-in-out
                ${isActive ? 'bg-yellow-400 text-black scale-105 shadow-lg shadow-yellow-400/30' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}
            `}
        >
            <span className="text-xs font-semibold">{sample.name.split(' - ')[1] || sample.name}</span>
        </button>
    );
};

export const ThaTraccMaster: React.FC<{audioEngine: AudioEngine; onBeatApplied: (beat: AiBeatSequence) => void;}> = ({audioEngine, onBeatApplied}) => {
    const [selectedKit, setSelectedKit] = useState<SamplePack>(samplePacks[0]);
    const [activePad, setActivePad] = useState<string | null>(null);
    const { addToast } = useToast();
    
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [beatSequence, setBeatSequence] = useState<AiBeatSequence | null>(null);

    const pads = selectedKit.samples.slice(0, 16); // Max 16 pads

    const handlePadClick = (sampleId: string) => {
        audioEngine.playSample(sampleId);
        setActivePad(sampleId);
        setTimeout(() => setActivePad(null), 150);
    };

    const handleGenerateBeat = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setBeatSequence(null);
        try {
            const result = await generateBeatSequence(prompt);
            setBeatSequence(result);
            addToast("AI beat sequence generated!", 'success');
        } catch (e: any) {
            addToast(e.message || 'Failed to generate beat.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleApplyBeat = () => {
        if (beatSequence) {
            onBeatApplied(beatSequence);
        } else {
            addToast('Generate a beat first.', 'error');
        }
    }

    return (
        <div className="p-4 h-full flex flex-col bg-gray-900/50">
            <div className="flex justify-between items-center mb-4">
                <select
                    value={selectedKit.id}
                    onChange={(e) => setSelectedKit(samplePacks.find(p => p.id === e.target.value) || samplePacks[0])}
                    className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                    {samplePacks.map(pack => (
                        <option key={pack.id} value={pack.id}>{pack.name}</option>
                    ))}
                </select>
                <button 
                    onClick={handleApplyBeat} 
                    disabled={!beatSequence}
                    className="flex items-center gap-2 bg-green-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Apply Beat to Track
                </button>
            </div>
            
            <div className="grid grid-cols-4 gap-2 md:gap-4 mb-4">
                {pads.map(sample => (
                    <DrumPad
                        key={sample.id}
                        sample={sample}
                        onPadClick={handlePadClick}
                        isActive={activePad === sample.id}
                    />
                ))}
            </div>

            <div className="mt-auto bg-gray-800/70 border border-gray-700 rounded-lg p-4">
                 <h4 className="flex items-center font-bold text-yellow-400 mb-3">
                    <MagicIcon className="w-5 h-5 mr-2" />
                    AI Beat Generator
                </h4>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., lofi hip hop beat"
                        className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerateBeat}
                        disabled={isLoading || !prompt}
                        className="bg-yellow-500 text-black font-semibold px-4 py-2 rounded-md hover:bg-yellow-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Creating...' : 'Generate'}
                    </button>
                </div>
                {beatSequence && (
                    <div className="mt-3 p-2 bg-gray-900 rounded-md border border-gray-600">
                        <p className="text-xs text-gray-400">Generated Sequence:</p>
                        <p className="text-sm text-yellow-300 font-mono break-words">{beatSequence.join(', ')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
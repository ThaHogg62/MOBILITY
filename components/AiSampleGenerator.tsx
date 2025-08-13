
import React, { useState } from 'react';
import { PlayIcon } from './icons';
import { generateSampleIdea } from '../services/geminiService';
import { AiGeneratedSample } from '../types';
import { useToast } from '../contexts/ToastContext';

interface AiSampleGeneratorProps {
    onAddSample: (sampleName: string) => void;
}

export const AiSampleGenerator: React.FC<AiSampleGeneratorProps> = ({ onAddSample }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedSample, setGeneratedSample] = useState<AiGeneratedSample | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setGeneratedSample(null);
    try {
      const result = await generateSampleIdea(prompt);
      setGeneratedSample(result);
    } catch (e: any) {
      addToast(e.message || 'Failed to generate sample.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <p className="text-sm text-gray-400 mb-4">Describe a sound and let AI create it for you. (e.g., "airy female vocal chop", "gritty boom-bap snare")</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your sound..."
          className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt}
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Creating...' : 'Generate'}
        </button>
      </div>
      
      <div className="mt-4 flex-grow">
          {generatedSample && (
            <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700 animate-fade-in">
              <h4 className="text-lg font-bold text-blue-300">{generatedSample.name}</h4>
              <p className="text-sm text-gray-400 mt-1 mb-4">{generatedSample.description}</p>
              <div className="flex items-center justify-between">
                <button title="Preview (simulation)" className="p-2 bg-gray-700 rounded-full text-white hover:bg-blue-600 transition-colors">
                    <PlayIcon className="w-5 h-5"/>
                </button>
                <button 
                    onClick={() => onAddSample(generatedSample.name)}
                    className="bg-green-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-500 transition-colors">
                    Add to Track
                </button>
              </div>
            </div>
          )}
      </div>
       <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
    </div>
  );
};

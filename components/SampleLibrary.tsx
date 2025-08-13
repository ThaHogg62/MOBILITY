
import React from 'react';
import { samplePacks } from '../data/samples';
import { MusicNoteIcon } from './icons';

interface SampleLibraryProps {
    onAddSample: (sampleName: string) => void;
}

export const SampleLibrary: React.FC<SampleLibraryProps> = ({ onAddSample }) => {
    return (
        <div className="p-4 h-full flex flex-col">
            <p className="text-sm text-gray-400 mb-4">Browse and add professional samples to your project.</p>
            <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                {samplePacks.map(pack => (
                    <div key={pack.id}>
                        <h4 className="font-semibold text-gray-200">{pack.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{pack.description}</p>
                        <ul className="space-y-1">
                            {pack.samples.map(sample => (
                                <li key={sample.id} className="flex items-center justify-between bg-gray-900/70 p-2 rounded-md group">
                                    <div className="flex items-center">
                                        <MusicNoteIcon className="w-4 h-4 mr-3 text-gray-500" />
                                        <span className="text-sm text-gray-300">{sample.name}</span>
                                    </div>
                                    <button
                                        onClick={() => onAddSample(sample.name)}
                                        className="text-xs bg-blue-600 text-white font-semibold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500">
                                        Add
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

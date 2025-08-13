
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { SubscriptionTier, Track as TrackType, User, Project, AiBeatSequence } from '../types';
import { TRACK_LIMITS } from '../constants';
import { PlayIcon, PauseIcon, StopIcon, RecordIcon, SaveIcon, MicIcon, MagicIcon, MusicNoteIcon, SparklesIcon, GridIcon } from './icons';
import { CreativeAssistant } from './CreativeAssistant';
import { SampleLibrary } from './SampleLibrary';
import { AiSampleGenerator } from './AiSampleGenerator';
import { ThaTraccMaster } from './ThaTraccMaster';
import { AudioEngine } from '../services/audioEngine';
import { useToast } from '../contexts/ToastContext';
import { saveProject } from '../services/projectService';

const Track: React.FC<{ 
    track: TrackType; 
    onArm: (id: number) => void; 
    onMute: (id: number) => void; 
    onSolo: (id: number) => void; 
    onTogglePreset: (id: number) => void;
    onNameChange: (id: number, newName: string) => void;
    isPremium: boolean; 
}> = React.memo(({ track, onArm, onMute, onSolo, onTogglePreset, onNameChange, isPremium }) => (
    <div className={`flex items-center bg-gray-800 p-3 rounded-lg border ${track.audioUrl ? 'border-green-500/50' : 'border-gray-700'} space-x-4`}>
        <div className="flex items-center space-x-2 w-1/4">
            <span className="text-gray-400">{String(track.id).padStart(2, '0')}</span>
            <input type="text" defaultValue={track.name} onChange={(e) => onNameChange(track.id, e.target.value)} className="bg-transparent text-white w-full outline-none" />
        </div>
        <div className="flex items-center space-x-2 flex-grow">
            <button onClick={() => onMute(track.id)} className={`w-8 h-8 rounded-md font-bold ${track.isMuted ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-gray-300'} hover:bg-yellow-600 transition-colors`}>M</button>
            <button onClick={() => onSolo(track.id)} className={`w-8 h-8 rounded-md font-bold ${track.isSolo ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'} hover:bg-blue-600 transition-colors`}>S</button>
            <button onClick={() => onArm(track.id)} className={`w-8 h-8 rounded-md flex items-center justify-center ${track.isArmed ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-700 text-gray-300'} hover:bg-red-700 transition-colors`}>
                <MicIcon className="w-5 h-5"/>
            </button>
        </div>
        <div className="w-1/3 flex items-center justify-end space-x-4">
            <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Vocal FX</span>
                <button
                    onClick={() => onTogglePreset(track.id)}
                    disabled={!isPremium}
                    title={isPremium ? "Toggle Real-time Vocal Preset" : "Available for Premium users"}
                    className={`w-10 h-5 rounded-full p-1 transition-colors ${track.useVocalPreset ? 'bg-blue-500' : 'bg-gray-600'} ${!isPremium ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                    <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${track.useVocalPreset ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </button>
            </div>
            <input type="range" className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        </div>
    </div>
));

const RightPanel: React.FC<{
    user: User;
    onUpgrade: () => void;
    onAddSampleToTrack: (sampleName: string) => void;
    onBeatApplied: (beat: AiBeatSequence) => void;
    audioEngine: AudioEngine;
}> = ({ user, onUpgrade, onAddSampleToTrack, onBeatApplied, audioEngine }) => {
    const [activeTab, setActiveTab] = useState('assistant');
    const { subscriptionTier } = user;

    if (subscriptionTier === SubscriptionTier.Free) {
        return (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center h-full flex flex-col justify-center">
                <h4 className="font-bold text-blue-400 mb-2">Unlock Premium Tools</h4>
                <p className="text-sm text-gray-400 mb-4">Upgrade to unlock the Creative Assistant, Sample Library, AI Generator, and Tha Tracc Master.</p>
                <button onClick={onUpgrade} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-500 transition-colors">View Plans</button>
            </div>
        );
    }
    
    const isExclusive = subscriptionTier === SubscriptionTier.Exclusive;

    const tabs = [
        { id: 'assistant', label: 'Assistant', icon: <MagicIcon className="w-5 h-5 mr-2" /> },
        { id: 'library', label: 'Library', icon: <MusicNoteIcon className="w-5 h-5 mr-2" /> },
        { id: 'generator', label: 'Generator', icon: <SparklesIcon className="w-5 h-5 mr-2" /> },
        { id: 'traccMaster', label: 'Tracc Master', icon: <GridIcon className="w-5 h-5 mr-2" />, exclusive: true },
    ];

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg h-full flex flex-col">
            <div className="flex border-b border-gray-700">
                {tabs.map(tab => {
                    if (tab.exclusive && !isExclusive) return null;
                    return (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center p-3 text-sm font-semibold transition-colors
                            ${activeTab === tab.id ? 'bg-gray-800/80 text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:bg-gray-700/50'}
                            ${tab.exclusive && isExclusive && activeTab === tab.id ? '!border-yellow-400 !text-yellow-400' : ''}
                        `}
                    >
                        {React.cloneElement(tab.icon, { className: `w-5 h-5 mr-2`})}
                        {tab.label}
                    </button>
                )})}
            </div>
            <div className="flex-grow relative overflow-y-auto">
                {activeTab === 'assistant' && <div className="p-4"><CreativeAssistant /></div>}
                {activeTab === 'library' && <SampleLibrary onAddSample={onAddSampleToTrack} />}
                {activeTab === 'generator' && <AiSampleGenerator onAddSample={onAddSampleToTrack} />}
                {activeTab === 'traccMaster' && isExclusive && <ThaTraccMaster audioEngine={audioEngine} onBeatApplied={onBeatApplied} />}
            </div>
        </div>
    );
};


export const Studio: React.FC<{ 
    user: User; 
    project: Project;
    setProject: (project: Project) => void;
    onUpgrade: () => void; 
    audioEngine: AudioEngine; 
}> = ({ user, project, setProject, onUpgrade, audioEngine }) => {
  const { subscriptionTier } = user;
  const isPremium = subscriptionTier === SubscriptionTier.Premium || subscriptionTier === SubscriptionTier.Exclusive;
  const trackLimit = useMemo(() => TRACK_LIMITS[subscriptionTier], [subscriptionTier]);
  const { addToast } = useToast();
  
  const { tracks } = project;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateTracks = (newTracks: TrackType[]) => {
      setProject({ ...project, tracks: newTracks });
  };
  
  const handleAddSampleToTrack = useCallback((sampleName: string) => {
    const newTracks = [...tracks];
    let trackToUpdateIndex = newTracks.findIndex(t => t.name.startsWith('Audio Track '));
    if (trackToUpdateIndex === -1 && newTracks.length > 0) trackToUpdateIndex = 0;

    if (trackToUpdateIndex !== -1) {
      newTracks[trackToUpdateIndex] = { ...newTracks[trackToUpdateIndex], name: sampleName, beatSequence: null };
      updateTracks(newTracks);
      addToast(`Sample "${sampleName}" loaded to track ${trackToUpdateIndex + 1}.`, 'info');
    } else {
        addToast("Please add a track first to load the sample.", 'error');
    }
  }, [tracks, addToast]);

  const handleBeatApplied = useCallback((beatSequence: AiBeatSequence) => {
    const newTracks = [...tracks];
    const armedTrackIndex = newTracks.findIndex(t => t.isArmed);
    const targetIndex = armedTrackIndex !== -1 ? armedTrackIndex : 0;

    if (newTracks.length > 0) {
        newTracks[targetIndex] = { ...newTracks[targetIndex], name: "MPC Beat", beatSequence };
        updateTracks(newTracks);
        addToast(`AI Beat applied to track ${targetIndex + 1}`, 'info');
    } else {
        addToast("Add a track to apply the beat.", 'error');
    }
  }, [tracks, addToast]);


  const addTrack = () => {
    if (tracks.length < trackLimit) {
      const newTrack: TrackType = {
        id: tracks.length > 0 ? Math.max(...tracks.map(t => t.id)) + 1 : 1, 
        name: `Audio Track ${tracks.length + 1}`,
        isMuted: false, isSolo: false, isArmed: false, useVocalPreset: false
      };
      updateTracks([...tracks, newTrack]);
    } else {
        addToast(`You've reached the ${trackLimit} track limit for your plan.`, 'info');
        onUpgrade();
    }
  };
  
  const handleArm = useCallback(async (id: number) => {
      if (isRecording) {
          addToast("Stop the current recording before arming a new track.", 'error');
          return;
      }
      updateTracks(tracks.map(track => ({ ...track, isArmed: track.id === id ? !track.isArmed : false })));
  }, [isRecording, addToast, tracks]);
  
  const handleMute = (id: number) => updateTracks(tracks.map(track => track.id === id ? { ...track, isMuted: !track.isMuted } : track));
  const handleSolo = (id: number) => updateTracks(tracks.map(track => track.id === id ? { ...track, isSolo: !track.isSolo } : track));
  const handleNameChange = (id: number, newName: string) => updateTracks(tracks.map(track => track.id === id ? { ...track, name: newName } : track));
  
  const handleTogglePreset = (id: number) => {
      if(isPremium){
          updateTracks(tracks.map(track => track.id === id ? {...track, useVocalPreset: !track.useVocalPreset} : track));
      }
  };

  const handleRecord = async () => {
    const armedTrack = tracks.find(t => t.isArmed);
    if (!armedTrack) {
        addToast("Arm a track to start recording.", 'error');
        return;
    }
    const success = await audioEngine.startRecording(armedTrack.id);
    if (success) {
        setIsRecording(true);
        setIsPlaying(true);
        addToast(`Recording on Track ${armedTrack.id}...`, 'info');
    } else {
        addToast("Could not start recording. Check microphone permissions.", 'error');
    }
  }
  
  const handleStop = async () => {
    if (isRecording) {
        const armedTrack = tracks.find(t => t.isArmed);
        if (armedTrack) {
            try {
                const audioUrl = await audioEngine.stopRecording(armedTrack.id);
                updateTracks(tracks.map(t => t.id === armedTrack.id ? { ...t, audioUrl, isArmed: false } : t));
                addToast(`Recording saved to Track ${armedTrack.id}.`, 'success');
            } catch (error) {
                addToast("Failed to stop recording.", 'error');
            }
        }
    }
    setIsPlaying(false);
    setIsRecording(false);
  }
  
  const handleExportWAV = async () => {
    addToast("Mixing down project...", 'info');
    const success = await audioEngine.mixdownAndSave(tracks);
    if (success) {
        addToast("Project exported as WAV file!", 'success');
    } else {
        addToast("No audio recorded to export.", 'error');
    }
  }

  const handleSaveProject = async () => {
      setIsSaving(true);
      try {
          await saveProject(user.uid, project);
          addToast("Project saved successfully!", 'success');
      } catch (error: any) {
          addToast(error.message || "Failed to save project.", 'error');
      } finally {
          setIsSaving(false);
      }
  }
  
  const tierColor = subscriptionTier === SubscriptionTier.Exclusive ? 'text-yellow-400' : subscriptionTier === SubscriptionTier.Premium ? 'text-blue-400' : 'text-gray-400';

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-center bg-gray-800/30 p-4 rounded-lg border border-gray-700">
        <div>
            <h2 className="text-2xl font-orbitron text-white">Session: My Project</h2>
            <p className="text-sm text-gray-400">Welcome, {user.name || 'Producer'} (<span className={`font-bold ${tierColor}`}>{subscriptionTier}</span> User)</p>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4 mt-4 md:mt-0">
          <button onClick={() => setIsPlaying(p => !p)} className="p-3 bg-gray-700 rounded-full text-white hover:bg-blue-600 transition-colors">
            {isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}
          </button>
          <button onClick={handleStop} className="p-3 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition-colors">
            <StopIcon className="w-6 h-6"/>
          </button>
          <button onClick={handleRecord} className={`p-3 rounded-full text-white transition-colors ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-gray-700 hover:bg-red-600'}`}>
            <RecordIcon className="w-6 h-6"/>
          </button>
          <button onClick={handleSaveProject} disabled={isSaving} title="Save Project" className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-500 transition-colors disabled:bg-gray-500">
              <SaveIcon className="w-6 h-6"/>
          </button>
          <button onClick={handleExportWAV} title="Export Project as WAV" className="p-2 bg-gray-800 text-gray-300 border border-gray-600 rounded-md text-sm font-semibold hover:bg-green-600 hover:text-white transition-colors">
              Export WAV
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xl font-bold text-gray-300">Tracks ({tracks.length}/{trackLimit})</h3>
          <div className="space-y-2 h-[60vh] overflow-y-auto pr-2">
            {tracks.map(track => <Track key={track.id} track={track} onArm={handleArm} onMute={handleMute} onSolo={handleSolo} onTogglePreset={handleTogglePreset} onNameChange={handleNameChange} isPremium={isPremium} />)}
          </div>
          <button onClick={addTrack} className="w-full py-2 bg-blue-600/20 text-blue-300 border border-blue-500 rounded-lg hover:bg-blue-600/40 transition-colors">
            + Add Track
          </button>
        </div>

        <div className="lg:col-span-1 space-y-6 flex flex-col">
            <h3 className="text-xl font-bold text-gray-300">Tools & Library</h3>
            <div className="flex-grow">
                 <RightPanel user={user} onUpgrade={onUpgrade} onAddSampleToTrack={handleAddSampleToTrack} onBeatApplied={handleBeatApplied} audioEngine={audioEngine} />
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                 <h3 className="text-xl font-bold text-gray-300 mb-4">Master Output</h3>
                 <div className="flex items-center space-x-4">
                     <span className="text-sm text-gray-400">Vol</span>
                     <input type="range" min="0" max="100" defaultValue="80" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg" />
                 </div>
            </div>
        </div>
      </main>
    </div>
  );
};
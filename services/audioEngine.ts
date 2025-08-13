
import { samplePacks } from '../data/samples';
import { Sample, Track } from '../types';

export class AudioEngine {
    private audioContext: AudioContext;
    private sampleBuffers: Map<string, AudioBuffer> = new Map();
    private recorder: MediaRecorder | null = null;
    private recordedChunks: Blob[] = [];
    private trackAudio: Map<number, Blob> = new Map();

    constructor() {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    private async createPlaceholderSound(type: Sample['type']): Promise<AudioBuffer> {
        const duration = type === 'kick' ? 0.15 : 0.1;
        const frameCount = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, frameCount, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        const noise = () => (Math.random() * 2 - 1);

        switch (type) {
            case 'kick':
                for (let i = 0; i < frameCount; i++) {
                    const t = i / frameCount;
                    const freq = 120 * Math.exp(-t * 25);
                    data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 10);
                }
                break;
            case 'snare':
            case 'clap':
                 for (let i = 0; i < frameCount; i++) {
                    const t = i / frameCount;
                    data[i] = noise() * Math.exp(-t * 20);
                }
                break;
            case 'hihat':
            case 'open-hat':
                for (let i = 0; i < frameCount; i++) {
                    data[i] = noise() * (i / frameCount > 0.5 ? 0 : 1); // High-pass filter simulation
                }
                break;
            default: // Muted for others
                for (let i = 0; i < frameCount; i++) data[i] = 0;
                break;
        }
        return buffer;
    }

    async loadSamples() {
        console.log("Loading samples into Audio Engine...");
        for (const pack of samplePacks) {
            for (const sample of pack.samples) {
                if (!this.sampleBuffers.has(sample.id)) {
                    const buffer = await this.createPlaceholderSound(sample.type);
                    this.sampleBuffers.set(sample.id, buffer);
                }
            }
        }
        console.log("Samples loaded.");
    }
    
    getSampleIdByName(name: string): string | undefined {
        for (const pack of samplePacks) {
            const found = pack.samples.find(s => s.name === name);
            if (found) return found.id;
        }
        return undefined;
    }

    playSample(sampleId: string) {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        const buffer = this.sampleBuffers.get(sampleId);
        if (buffer) {
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioContext.destination);
            source.start();
        } else {
            console.warn(`Sample with id ${sampleId} not found.`);
        }
    }

    async startRecording(trackId: number) {
        if (this.recorder) {
            console.warn("Recording already in progress.");
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.recorder = new MediaRecorder(stream);
            this.recordedChunks = [];
            
            this.recorder.ondataavailable = event => {
                this.recordedChunks.push(event.data);
            };

            this.recorder.onstop = () => {
                const audioBlob = new Blob(this.recordedChunks, { type: 'audio/wav' });
                this.trackAudio.set(trackId, audioBlob);
                stream.getTracks().forEach(track => track.stop());
                this.recorder = null;
            };
            
            this.recorder.start();
            console.log(`Recording started for track ${trackId}`);
            return true;
        } catch (err) {
            console.error("Error starting recording:", err);
            return false;
        }
    }

    stopRecording(trackId: number): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.recorder && this.recorder.state === 'recording') {
                this.recorder.onstop = () => {
                    const audioBlob = new Blob(this.recordedChunks, { type: 'audio/wav' });
                    this.trackAudio.set(trackId, audioBlob);
                    const audioUrl = URL.createObjectURL(audioBlob);
                    this.recorder = null;
                    resolve(audioUrl);
                };
                this.recorder.stop();
                 console.log(`Recording stopped for track ${trackId}`);
            } else {
                reject("Not currently recording.");
            }
        });
    }

    private audioBufferToWav(buffer: AudioBuffer): Blob {
        const numOfChan = buffer.numberOfChannels;
        const length = buffer.length * numOfChan * 2 + 44;
        const bufferArr = new ArrayBuffer(length);
        const view = new DataView(bufferArr);
        const channels = [];
        let i, sample;
        let offset = 0;
        let pos = 0;

        // Header
        this.setUint32(view, pos, 0x46464952); pos += 4; // "RIFF"
        this.setUint32(view, pos, length - 8); pos += 4; // file length - 8
        this.setUint32(view, pos, 0x45564157); pos += 4; // "WAVE"
        this.setUint32(view, pos, 0x20746d66); pos += 4; // "fmt "
        this.setUint32(view, pos, 16); pos += 4; //
        this.setUint16(view, pos, 1); pos += 2; //
        this.setUint16(view, pos, numOfChan); pos += 2; //
        this.setUint32(view, pos, buffer.sampleRate); pos += 4; //
        this.setUint32(view, pos, buffer.sampleRate * 2 * numOfChan); pos += 4; //
        this.setUint16(view, pos, numOfChan * 2); pos += 2; //
        this.setUint16(view, pos, 16); pos += 2; //
        this.setUint32(view, pos, 0x61746164); pos += 4; // "data"
        this.setUint32(view, pos, length - pos - 4); pos += 4; //

        for (i = 0; i < buffer.numberOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
        }

        while (pos < length) {
            for (i = 0; i < numOfChan; i++) {
                sample = Math.max(-1, Math.min(1, channels[i][offset]));
                sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
                view.setInt16(pos, sample, true);
                pos += 2;
            }
            offset++;
        }

        return new Blob([view], { type: "audio/wav" });
    }
    
    private setUint16(view: DataView, offset: number, val: number) { view.setUint16(offset, val, true); }
    private setUint32(view: DataView, offset: number, val: number) { view.setUint32(offset, val, true); }

    async mixdownAndSave(tracks: Track[]) {
        if (this.trackAudio.size === 0) {
            console.log("No audio recorded to mixdown.");
            return null;
        }

        const offlineContext = new OfflineAudioContext(
            2,
            this.audioContext.sampleRate * 10, // Max 10s length for now
            this.audioContext.sampleRate
        );

        let maxDuration = 0;

        const trackBuffers = await Promise.all(
            Array.from(this.trackAudio.entries()).map(async ([trackId, blob]) => {
                const arrayBuffer = await blob.arrayBuffer();
                const audioBuffer = await offlineContext.decodeAudioData(arrayBuffer);
                if(audioBuffer.duration > maxDuration) maxDuration = audioBuffer.duration;
                return { trackId, audioBuffer };
            })
        );
        
        if(maxDuration === 0) {
             console.log("No valid audio buffers found.");
             return null;
        }
        
        const finalContext = new OfflineAudioContext(2, Math.ceil(maxDuration * offlineContext.sampleRate) + 44100, offlineContext.sampleRate);

        await Promise.all(trackBuffers.map(async ({ audioBuffer }) => {
             const source = finalContext.createBufferSource();
             source.buffer = audioBuffer;
             source.connect(finalContext.destination);
             source.start(0);
        }));

        const mixedBuffer = await finalContext.startRendering();
        const wavBlob = this.audioBufferToWav(mixedBuffer);
        const url = URL.createObjectURL(wavBlob);

        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = url;
        a.download = `tha-mobile-lab-mixdown.wav`;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        
        return true;
    }
}

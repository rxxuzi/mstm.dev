'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Play, Square, Download, Activity, RefreshCw } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Constants ---
const STEPS = 16;
const INITIAL_BPM = 120; // Standard usable tempo

type InstrumentType = 'KICK' | 'SNARE' | 'CLAP' | 'CH' | 'OH' | 'LT' | 'HT' | 'CRASH';

interface Track {
  id: InstrumentType;
  name: string;
  type: 'MEMBRANE' | 'NOISE' | 'METAL';
}

const TRACKS: Track[] = [
  { id: 'KICK', name: 'BD // 808', type: 'MEMBRANE' },
  { id: 'SNARE', name: 'SD // 808', type: 'NOISE' },
  { id: 'CLAP', name: 'CP // 808', type: 'NOISE' },
  { id: 'CH', name: 'CH // 808', type: 'METAL' },
  { id: 'OH', name: 'OH // 808', type: 'METAL' },
  { id: 'LT', name: 'LT // 808', type: 'MEMBRANE' },
  { id: 'HT', name: 'HT // 808', type: 'MEMBRANE' },
  { id: 'CRASH', name: 'CY // 808', type: 'METAL' },
];

export default function DrumMachine() {
  // --- State ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(INITIAL_BPM);
  const [swing, setSwing] = useState(0);
  const [grid, setGrid] = useState<boolean[][]>(
    TRACKS.map(() => Array(STEPS).fill(false))
  );

  // Hydration fix: CPU stats defined in state, not render
  const [cpuUsage, setCpuUsage] = useState(0);

  // --- Audio Refs ---
  const synths = useRef<(Tone.MembraneSynth | Tone.NoiseSynth | Tone.MetalSynth)[]>([]);
  const recorder = useRef<Tone.Recorder | null>(null);

  // --- Audio Engine Setup ---
  useEffect(() => {
    // Master Output
    const limiter = new Tone.Limiter(-1).toDestination();
    recorder.current = new Tone.Recorder();
    limiter.connect(recorder.current);

    // Initialize Synths based on Track Type
    synths.current = TRACKS.map((track) => {
      let synth;

      if (track.id === 'KICK') {
        synth = new Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 5,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 },
        }).connect(limiter);
        synth.volume.value = 0; // Standard level
      }
      else if (track.id === 'LT' || track.id === 'HT') {
        synth = new Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 4,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 1 },
        }).connect(limiter);
        synth.volume.value = -2;
      }
      else if (track.id === 'SNARE') {
        synth = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
        }).connect(limiter);
        synth.volume.value = -4;
      }
      else if (track.id === 'CLAP') {
        // Simulating clap with filtered noise
        const filter = new Tone.Filter(1500, "bandpass").connect(limiter);
        synth = new Tone.NoiseSynth({
          noise: { type: 'pink' },
          envelope: { attack: 0.001, decay: 0.25, sustain: 0 },
        }).connect(filter);
        synth.volume.value = -5;
      }
      else if (track.id === 'CH' || track.id === 'OH') {
        synth = new Tone.MetalSynth({
          envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
          harmonicity: 5.1,
          modulationIndex: 32,
          resonance: 4000,
          octaves: 1.5,
        }).connect(limiter);
        synth.frequency.value = 200;
        synth.volume.value = -12;
      }
      else {
        // Crash
        synth = new Tone.MetalSynth({
          envelope: { attack: 0.001, decay: 1.0, release: 0.2 },
          harmonicity: 5.1,
          modulationIndex: 64,
          resonance: 3000,
          octaves: 1.5,
        }).connect(limiter);
        synth.frequency.value = 300;
        synth.volume.value = -10;
      }

      return synth;
    });

    // Hydration Safe CPU Randomizer
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCpuUsage(Math.floor(Math.random() * 15) + 5);

    return () => {
      synths.current.forEach(s => s.dispose());
      recorder.current?.dispose();
    };
  }, []);

  // --- Sequencer Loop ---
  useEffect(() => {
    const loop = new Tone.Sequence(
      (time, step) => {
        Tone.Draw.schedule(() => {
          setCurrentStep(step);
        }, time);

        grid.forEach((trackSteps, trackIndex) => {
          if (trackSteps[step]) {
            const synth = synths.current[trackIndex];
            const trackId = TRACKS[trackIndex].id;

            // Trigger specific notes for MembraneSynths
            if (trackId === 'KICK') synth.triggerAttackRelease('C1', '8n', time);
            else if (trackId === 'LT') synth.triggerAttackRelease('F1', '8n', time);
            else if (trackId === 'HT') synth.triggerAttackRelease('C2', '8n', time);
            else if (trackId === 'OH') {
              synth.envelope.decay = 0.5; // Open
              synth.triggerAttackRelease('32n', time);
            }
            else if (trackId === 'CH') {
              synth.envelope.decay = 0.05; // Closed
              synth.triggerAttackRelease('32n', time);
            }
            else {
              synth.triggerAttackRelease('16n', time); // Noise/Other
            }
          }
        });
      },
      Array.from({ length: STEPS }, (_, i) => i),
      '16n'
    );

    loop.start(0);
    return () => {
      loop.dispose();
    };
  }, [grid]);

  // --- Transport Control ---
  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
    Tone.Transport.swing = swing;
  }, [bpm, swing]);

  const togglePlay = async () => {
    await Tone.start();
    if (isPlaying) {
      Tone.Transport.stop();
      setCurrentStep(0);
    } else {
      Tone.Transport.start();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleRecord = async () => {
    if (!recorder.current) return;
    if (isRecording) {
      const recording = await recorder.current.stop();
      const url = URL.createObjectURL(recording);
      const anchor = document.createElement("a");
      anchor.download = `BEAT_EXPORT_${Date.now()}.webm`;
      anchor.href = url;
      anchor.click();
      setIsRecording(false);
    } else {
      recorder.current.start();
      setIsRecording(true);
    }
  };

  const toggleStep = (trackIndex: number, stepIndex: number) => {
    const newGrid = [...grid];
    newGrid[trackIndex][stepIndex] = !newGrid[trackIndex][stepIndex];
    setGrid(newGrid);
  };

  const clearPattern = () => {
    setGrid(TRACKS.map(() => Array(STEPS).fill(false)));
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-[#EBEBEB] text-black font-sans flex flex-col items-center justify-center p-4 selection:bg-black selection:text-[#FFFF00]">

      {/* Background Watermark (Hydration Safe) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">
        <h1 className="text-[15vw] font-black text-black opacity-[0.02] tracking-tighter select-none">
          STUDIO
        </h1>
      </div>

      {/* --- MAIN CHASSIS --- */}
      <div className="w-full max-w-7xl bg-[#F5F5F5] border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] z-10 relative flex flex-col md:flex-row">

        {/* === LEFT: CONTROL PANEL === */}
        <div className="w-full md:w-72 border-b-[3px] md:border-b-0 md:border-r-[3px] border-black bg-white flex flex-col shrink-0">

          {/* Header */}
          <div className="p-5 border-b-[3px] border-black">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">Drum_Sys</h2>
            <div className="flex justify-between items-end mt-2">
              <span className="text-[10px] font-bold tracking-widest text-zinc-400">VER. 1.0</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-black"></div>
                <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
              </div>
            </div>
          </div>

          {/* Transport */}
          <div className="p-5 border-b-[3px] border-black bg-zinc-50 flex-1 flex flex-col gap-6">
            <button
              onClick={togglePlay}
              className={cn(
                "w-full py-4 border-[2px] border-black font-black tracking-widest text-lg transition-all active:translate-y-1 hover:bg-black hover:text-white flex items-center justify-center gap-3",
                isPlaying ? "bg-black text-white" : "bg-white text-black"
              )}
            >
              {isPlaying ? <Square size={18} fill="currentColor"/> : <Play size={18} fill="currentColor"/>}
              {isPlaying ? "STOP" : "PLAY"}
            </button>

            {/* BPM */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold tracking-wider">
                <span>BPM</span>
                <span className="bg-black text-white px-2 py-0.5">{bpm}</span>
              </div>
              <input
                type="range" min="60" max="200" value={bpm} onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-none appearance-none cursor-ew-resize [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#0000FF] [&::-webkit-slider-thumb]:border-[1px] [&::-webkit-slider-thumb]:border-black"
              />
            </div>

            {/* Swing */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold tracking-wider">
                <span>SWING</span>
                <span>{Math.round(swing * 100)}%</span>
              </div>
              <input
                type="range" min="0" max="0.5" step="0.01" value={swing} onChange={(e) => setSwing(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-none appearance-none cursor-ew-resize [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#0000FF] [&::-webkit-slider-thumb]:border-[1px] [&::-webkit-slider-thumb]:border-black"
              />
            </div>
          </div>

          {/* Tools */}
          <div className="p-5 flex flex-col gap-3 bg-[#FFFF00]">
            <div className="text-[10px] font-bold tracking-widest mb-1 opacity-70">TOOLS</div>
            <div className="flex gap-2">
              <button
                onClick={toggleRecord}
                className={cn(
                  "flex-1 h-10 border-[2px] border-black flex items-center justify-center hover:bg-white transition-colors",
                  isRecording ? "bg-red-500 text-white animate-pulse" : "bg-transparent text-black"
                )}
                title="Export Audio"
              >
                <Download size={18} />
              </button>
              <button
                onClick={clearPattern}
                className="flex-1 h-10 border-[2px] border-black flex items-center justify-center hover:bg-white transition-colors"
                title="Clear Grid"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* === RIGHT: SEQUENCER GRID === */}
        <div className="flex-1 bg-white flex flex-col relative overflow-hidden">

          {/* Top Indicator Bar */}
          <div className="h-10 border-b-[3px] border-black bg-zinc-100 flex items-center px-6 gap-1">
            {Array.from({length: STEPS}).map((_, i) => (
              <div key={i} className={cn(
                "flex-1 h-1.5 transition-colors",
                currentStep === i ? "bg-[#0000FF]" : "bg-zinc-300"
              )} />
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 p-6 overflow-x-auto overflow-y-auto">
            <div className="min-w-[700px] flex flex-col gap-3">
              {TRACKS.map((track, tIdx) => (
                <div key={track.id} className="flex gap-4 items-center h-10">
                  {/* Label */}
                  <div className="w-24 flex-shrink-0 flex items-center justify-end pr-4 border-r-2 border-black/10">
                    <span className="font-bold text-xs tracking-tighter">{track.name}</span>
                  </div>

                  {/* Steps */}
                  <div className="flex-1 grid grid-cols-16 gap-1 h-full">
                    {grid[tIdx].map((isActive, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => toggleStep(tIdx, sIdx)}
                        className={cn(
                          "h-full w-full transition-all duration-75 border",
                          // Design Fix: Removed 'crosshair' decoration. Pure color blocks.
                          isActive
                            ? "bg-black border-black"
                            : "bg-white border-zinc-200 hover:border-black hover:bg-zinc-50",

                          // Playhead visual
                          currentStep === sIdx && !isActive && "bg-zinc-200",
                          currentStep === sIdx && isActive && "bg-[#0000FF] border-[#0000FF]"
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Status */}
          <div className="h-8 border-t-[3px] border-black bg-black text-white flex items-center justify-between px-4 text-[10px] font-mono tracking-wider">
              <span className="flex items-center gap-2">
                 <Activity size={10} /> SYSTEM_READY
              </span>
            <span>CPU: {cpuUsage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
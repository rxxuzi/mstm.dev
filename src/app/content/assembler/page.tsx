'use client';

import React, { useState, useEffect, useRef } from 'react';
import { assemble } from './lib/asm';
import { stepWithMem, INITIAL_STATE, CpuState } from './lib/cpu';
import { REGISTERS, INSTRUCTION_SET_DOCS } from './lib/isa';

const DEFAULT_CODE = `; Hello World
start:
    MOV C, hello
    MOV D, 232
    CALL print
    HLT

print:
    PUSH A
.loop:
    MOV A, [C]
    CMP A, 0
    JZ .done
    MOV [D], A
    INC C
    JMP .loop
.done:
    POP A
    RET

hello:
    DB "Hello World!"
    DB 0
`;

// Pre-compile default code for initial state
const INITIAL_ASSEMBLY = assemble(DEFAULT_CODE);

// Register colors: A=Red, B=Green, C=Purple, D=Pink
const REG_COLORS = ['#DC2626', '#16A34A', '#9333EA', '#EC4899'];
const REG_BG_CLASSES = ['bg-red-600', 'bg-green-600', 'bg-purple-600', 'bg-pink-500'];

export default function AssemblerSim() {
  const [source, setSource] = useState(DEFAULT_CODE);
  const [cpu, setCpu] = useState<CpuState>(INITIAL_STATE);
  const [memory, setMemory] = useState<Uint8Array>(() => INITIAL_ASSEMBLY.machineCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [clockSpeed, setClockSpeed] = useState(8);
  const [showDocs, setShowDocs] = useState(false);
  const [labels, setLabels] = useState<Record<string, number>>(() => INITIAL_ASSEMBLY.labels);
  const [sourceMap, setSourceMap] = useState<number[]>(() => INITIAL_ASSEMBLY.sourceMap);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stateRef = useRef({ cpu, memory });

  // Update ref in useEffect to avoid render-time mutation
  useEffect(() => {
    stateRef.current = { cpu, memory };
  }, [cpu, memory]);

  const compile = (code: string) => {
    const res = assemble(code);
    if (res.error) {
      setOutput(`ERROR: ${res.error}`);
      return null;
    }
    setMemory(res.machineCode);
    setLabels(res.labels);
    setSourceMap(res.sourceMap);
    return res;
  };

  const handleReset = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCpu(INITIAL_STATE);
    setOutput('');
    compile(source);
  };

  const safeStep = () => {
    const { cpu: currentCpu, memory: currentMem } = stateRef.current;
    if (currentCpu.halted) {
      setIsRunning(false);
      return;
    }
    const { newState, newMem, outChar } = stepWithMem(currentCpu, currentMem);
    setCpu(newState);
    setMemory(newMem);
    if (outChar) setOutput(prev => prev + outChar);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(safeStep, 1000 / clockSpeed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, clockSpeed]);

  const boxStyle = 'border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';

  return (
    <div className="min-h-screen bg-[#F3F3F3] text-black font-sans p-4 md:p-8 flex flex-col gap-6 selection:bg-blue-200">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b-4 border-black pb-4 gap-4">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">8-BIT ASSEMBLER</h1>
          <p className="text-xs font-mono mt-2 bg-black text-white inline-block px-2 py-1">SIMULATED ENVIRONMENT V2.1</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="border-2 border-black px-2 py-1 flex gap-2 bg-white">
            <span className="text-xs font-bold self-center">CLOCK</span>
            {[1, 4, 8, 16].map(hz => (
              <button
                key={hz}
                onClick={() => setClockSpeed(hz)}
                className={`text-xs font-bold px-2 py-1 transition-colors ${
                  clockSpeed === hz ? 'bg-black text-white' : 'hover:bg-gray-200'
                }`}
              >
                {hz}HZ
              </button>
            ))}
          </div>
          <button
            onClick={handleReset}
            className="border-2 border-black px-6 py-2 font-bold uppercase hover:bg-black hover:text-white transition-all active:translate-y-1"
          >
            RESET
          </button>
          <button
            onClick={safeStep}
            disabled={isRunning}
            className="border-2 border-black px-6 py-2 font-bold uppercase hover:bg-black hover:text-white disabled:opacity-50 transition-all active:translate-y-1"
          >
            STEP
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`border-2 border-black px-6 py-2 font-bold uppercase transition-all active:translate-y-1 ${
              isRunning ? 'bg-blue-600 text-white border-blue-600' : 'bg-black text-white'
            }`}
          >
            {isRunning ? 'PAUSE' : 'RUN'}
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Code */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className={`${boxStyle} flex-1 flex flex-col min-h-[500px] relative`}>
            <div className="flex justify-between items-center p-3 border-b-2 border-black bg-gray-100">
              <h2 className="font-bold text-sm uppercase">Source Code</h2>
              <button
                onClick={() => setShowDocs(!showDocs)}
                className="text-xs font-bold underline hover:bg-black hover:text-white px-1"
              >
                INSTRUCTION SET
              </button>
            </div>
            <div className="flex flex-1 relative bg-white overflow-hidden">
              <div className="w-10 bg-gray-100 border-r border-gray-200 text-right pr-2 pt-4 text-xs font-mono text-gray-400 select-none">
                {source.split('\n').map((_, i) => (
                  <div
                    key={i}
                    className={`h-6 ${sourceMap[cpu.ip] === i ? 'bg-blue-600 text-white font-bold pr-1' : ''}`}
                  >
                    {(i + 1).toString().padStart(2, '0')}
                  </div>
                ))}
              </div>
              <textarea
                className="flex-1 resize-none p-4 font-mono text-sm leading-6 outline-none whitespace-pre"
                value={source}
                onChange={e => setSource(e.target.value)}
                spellCheck={false}
              />
            </div>

            {/* Docs Overlay */}
            {showDocs && (
              <div className="absolute inset-0 bg-white/95 z-10 p-6 overflow-auto border-l-4 border-black">
                <div className="flex justify-between mb-4">
                  <h3 className="font-bold text-xl uppercase">Instruction Set</h3>
                  <button onClick={() => setShowDocs(false)} className="font-bold text-xl">
                    ✕
                  </button>
                </div>
                <table className="w-full text-xs font-mono">
                  <thead>
                  <tr className="border-b-2 border-black text-left">
                    <th className="py-2">OP</th>
                    <th>ARGS</th>
                    <th>DESC</th>
                  </tr>
                  </thead>
                  <tbody>
                  {INSTRUCTION_SET_DOCS.map(d => (
                    <tr key={d.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-2 font-bold">{d.mnemonic}</td>
                      <td>{d.args}</td>
                      <td className="text-gray-500">{d.desc}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: State */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Registers */}
            <div className={`${boxStyle} p-4`}>
              <h2 className="font-bold text-sm uppercase mb-4">CPU Registers & Flags</h2>

              <div className="grid grid-cols-4 gap-3 mb-6">
                {REGISTERS.map((r, i) => (
                  <div
                    key={r}
                    className="flex flex-col items-center p-2 border-b-4"
                    style={{ borderColor: REG_COLORS[i] }}
                  >
                    <span className="text-xs font-bold mb-1" style={{ color: REG_COLORS[i] }}>
                      {r}
                    </span>
                    <span className="text-xl font-mono font-bold" style={{ color: REG_COLORS[i] }}>
                      {cpu.regs[i].toString(16).toUpperCase().padStart(2, '0')}
                    </span>
                    <span className="text-[9px]" style={{ color: REG_COLORS[i], opacity: 0.7 }}>
                      DEC:{cpu.regs[i]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 border-t-2 border-black pt-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold block mb-1">IP</span>
                    <div className="bg-blue-600 text-white font-mono text-center py-1 font-bold">
                      {cpu.ip.toString(16).toUpperCase().padStart(2, '0')}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold block mb-1">SP</span>
                    <div className="bg-amber-500 text-white font-mono text-center py-1 font-bold">
                      {cpu.sp.toString(16).toUpperCase().padStart(2, '0')}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 items-end justify-end">
                  <FlagBox name="Z" on={cpu.flags.z} />
                  <FlagBox name="C" on={cpu.flags.c} />
                  <FlagBox name="F" on={cpu.flags.f} />
                </div>
              </div>
            </div>

            {/* Output */}
            <div className={`${boxStyle} flex flex-col`}>
              <div className="bg-black text-white p-2 text-xs uppercase font-bold">Output</div>
              <div className="flex-1 bg-black p-4 font-mono text-white overflow-hidden text-lg leading-none min-h-[150px]">
                {output}
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>

          {/* RAM */}
          <div className={`${boxStyle} flex-1 p-4`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-sm uppercase">RAM (Memory)</h2>
              <div className="flex gap-3 text-[10px] font-bold uppercase">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-600" /> IP
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-amber-500" /> SP
                </span>
                {REGISTERS.map((r, i) => (
                  <span key={r} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: REG_COLORS[i] }} />
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(20px,1fr))] gap-[2px] bg-gray-200 border-2 border-gray-200">
              {Array.from(memory).map((byte, idx) => {
                let bgClass = 'bg-white';
                let textClass = 'text-gray-300';

                if (idx === cpu.ip) {
                  bgClass = 'bg-blue-600';
                  textClass = 'text-white font-bold z-10 scale-110 shadow-lg';
                } else if (idx === cpu.sp) {
                  bgClass = 'bg-amber-500';
                  textClass = 'text-white font-bold';
                } else {
                  const matchingRegIndex = cpu.regs.findIndex(val => val === idx);
                  if (matchingRegIndex !== -1) {
                    bgClass = REG_BG_CLASSES[matchingRegIndex];
                    textClass = 'text-white font-bold';
                  } else if (byte !== 0) {
                    textClass = 'text-black font-medium';
                  }
                }

                return (
                  <div
                    key={idx}
                    className={`aspect-square text-[9px] font-mono flex items-center justify-center relative transition-colors ${bgClass} ${textClass}`}
                    title={`ADDR: ${idx} (0x${idx.toString(16)})`}
                  >
                    {byte.toString(16).toUpperCase().padStart(2, '0')}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Labels */}
          <div className={`${boxStyle} p-4`}>
            <h2 className="font-bold text-sm uppercase border-b-2 border-black mb-2 pb-1">Labels</h2>
            <div className="flex flex-wrap gap-4 font-mono text-xs">
              {Object.keys(labels).length === 0 && (
                <span className="text-gray-400">NO LABELS FOUND</span>
              )}
              {Object.entries(labels).map(([name, addr]) => (
                <div key={name} className="flex gap-2 bg-gray-100 px-2 py-1 border border-gray-200">
                  <span className="font-bold">{name}</span>
                  <span className="text-gray-500">
                    0x{addr.toString(16).toUpperCase().padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FlagBox({ name, on }: { name: string; on: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[9px] font-bold mb-1 text-gray-400">{name}</span>
      <div
        className={`w-8 py-1 text-center text-xs font-bold border-2 ${
          on ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-300 border-gray-200'
        }`}
      >
        {on ? 'T' : 'F'}
      </div>
    </div>
  );
}
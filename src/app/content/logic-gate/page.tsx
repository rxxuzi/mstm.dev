'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

type GateType = 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'NOT';

interface CircuitStep {
    id: number;
    gate: GateType;
    input1: string;
    input2?: string;
}

interface PuzzleTemplate {
    gates: GateType[];
    build: (a: string, b: string, c?: string) => string;
    difficulty: 'easy' | 'medium' | 'hard';
}

const BitRow = ({ bits, label, variant = 'default' }: {
    bits: string;
    label: string;
    variant?: 'default' | 'target' | 'result' | 'dim';
}) => (
  <div className="flex items-center gap-4">
      <div
        className={`
          w-10 text-right text-xs tracking-wide
          ${variant === 'target' ? 'text-emerald-600' : variant === 'result' ? 'text-cyan-600' : 'text-zinc-600'}
        `}
        style={{ fontFamily: 'Georgia, serif' }}
      >
          {label}
      </div>
      <div className="flex">
          {bits.split('').map((bit, i) => (
            <div
              key={i}
              className={`
              w-5 h-6 flex items-center justify-center
              font-mono text-xs font-medium
              border-r border-zinc-900 last:border-r-0
              transition-colors duration-100
              ${variant === 'target'
                    ? bit === '1' ? 'bg-emerald-950/80 text-emerald-400' : 'bg-black text-zinc-800'
                    : variant === 'result'
                      ? bit === '1' ? 'bg-cyan-950/80 text-cyan-400' : 'bg-black text-zinc-800'
                      : variant === 'dim'
                        ? bit === '1' ? 'bg-zinc-900/50 text-zinc-600' : 'bg-black text-zinc-800'
                        : bit === '1' ? 'bg-zinc-900 text-zinc-300' : 'bg-black text-zinc-700'
                  }
            `}
            >
                {bit}
            </div>
          ))}
      </div>
  </div>
);

export default function LogicGatePuzzle() {
    const [mounted, setMounted] = useState(false);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [inputA, setInputA] = useState('');
    const [inputB, setInputB] = useState('');
    const [inputC, setInputC] = useState('');
    const [targetOutput, setTargetOutput] = useState('');
    const [requiredGates, setRequiredGates] = useState<GateType[]>([]);
    const [userCircuit, setUserCircuit] = useState<CircuitStep[]>([]);
    const [signals, setSignals] = useState<Record<string, string>>({});
    const [isComplete, setIsComplete] = useState(false);
    const [stepIdCounter, setStepIdCounter] = useState(0);

    const applyGate = useCallback((gate: GateType, a: string, b?: string): string => {
        const ops: Record<GateType, (x: number, y?: number) => number> = {
            'AND': (x, y) => x & (y ?? 0),
            'OR': (x, y) => x | (y ?? 0),
            'XOR': (x, y) => x ^ (y ?? 0),
            'NAND': (x, y) => (~(x & (y ?? 0))) & 1,
            'NOR': (x, y) => (~(x | (y ?? 0))) & 1,
            'NOT': (x) => (~x) & 1,
        };

        if (gate === 'NOT') {
            return a.split('').map(bit => ops[gate](parseInt(bit)).toString()).join('');
        }
        return a.split('').map((bit, i) =>
          ops[gate](parseInt(bit), parseInt(b?.[i] ?? '0')).toString()
        ).join('');
    }, []);

    const puzzleTemplates: PuzzleTemplate[] = useMemo(() => [
        { gates: ['AND', 'NOT'], build: (a, b) => applyGate('NOT', applyGate('AND', a, b)), difficulty: 'easy' },
        { gates: ['OR', 'NOT'], build: (a, b) => applyGate('NOT', applyGate('OR', a, b)), difficulty: 'easy' },
        { gates: ['XOR', 'NOT'], build: (a, b) => applyGate('NOT', applyGate('XOR', a, b)), difficulty: 'easy' },
        { gates: ['NOT', 'AND'], build: (a, b) => applyGate('AND', applyGate('NOT', a), b), difficulty: 'easy' },
        { gates: ['NOT', 'OR'], build: (a, b) => applyGate('OR', applyGate('NOT', a), b), difficulty: 'easy' },
        { gates: ['NOT', 'XOR'], build: (a, b) => applyGate('XOR', applyGate('NOT', a), b), difficulty: 'easy' },
        { gates: ['AND', 'OR', 'NOT'], build: (a, b) => applyGate('NOT', applyGate('OR', applyGate('AND', a, b), b)), difficulty: 'medium' },
        { gates: ['XOR', 'AND', 'NOT'], build: (a, b) => applyGate('NOT', applyGate('AND', applyGate('XOR', a, b), a)), difficulty: 'medium' },
        { gates: ['NOT', 'NOT', 'AND'], build: (a, b) => applyGate('AND', applyGate('NOT', a), applyGate('NOT', b)), difficulty: 'medium' },
        { gates: ['NOT', 'NOT', 'OR'], build: (a, b) => applyGate('OR', applyGate('NOT', a), applyGate('NOT', b)), difficulty: 'medium' },
        { gates: ['OR', 'AND', 'XOR'], build: (a, b) => applyGate('XOR', applyGate('AND', a, b), applyGate('OR', a, b)), difficulty: 'medium' },
        { gates: ['AND', 'OR', 'XOR'], build: (a, b, c) => applyGate('XOR', applyGate('AND', a, b), applyGate('OR', b, c!)), difficulty: 'hard' },
        { gates: ['XOR', 'AND', 'NOT'], build: (a, b, c) => applyGate('NOT', applyGate('AND', applyGate('XOR', a, b), c!)), difficulty: 'hard' },
        { gates: ['OR', 'AND', 'NAND'], build: (a, b, c) => applyGate('NAND', applyGate('OR', a, b), applyGate('AND', b, c!)), difficulty: 'hard' },
        { gates: ['NOT', 'XOR', 'AND', 'OR'], build: (a, b, c) => applyGate('OR', applyGate('AND', applyGate('XOR', a, b), c!), applyGate('NOT', c!)), difficulty: 'hard' },
        { gates: ['AND', 'OR', 'XOR', 'NOT'], build: (a, b, c) => applyGate('NOT', applyGate('XOR', applyGate('AND', a, b), applyGate('OR', b, c!))), difficulty: 'hard' },
    ], [applyGate]);

    const generateBits = useCallback((length: number): string => {
        return Array(length).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join('');
    }, []);

    const generatePuzzle = useCallback(() => {
        const bitLength = 8;
        const templates = puzzleTemplates.filter(t => t.difficulty === difficulty);
        const template = templates[Math.floor(Math.random() * templates.length)];

        let a: string, b: string, c: string, output: string;
        let attempts = 0;

        do {
            a = generateBits(bitLength);
            b = generateBits(bitLength);
            c = difficulty === 'hard' ? generateBits(bitLength) : '';
            output = template.build(a, b, c || undefined);
            attempts++;
        } while (
          attempts < 20 && (
            output === a || output === b || output === c ||
            output === applyGate('NOT', a) ||
            output === applyGate('NOT', b) ||
            (c && output === applyGate('NOT', c)) ||
            output === '00000000' || output === '11111111'
          )
          );

        setInputA(a);
        setInputB(b);
        setInputC(c);
        setTargetOutput(output);
        setRequiredGates([...template.gates]);
        setUserCircuit([]);
        setSignals({ A: a, B: b, ...(c ? { C: c } : {}) });
        setIsComplete(false);
        setStepIdCounter(0);
    }, [difficulty, puzzleTemplates, generateBits, applyGate]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (mounted) generatePuzzle();
    }, [mounted, difficulty, generatePuzzle]);

    // Calculate signals - update input references when steps are removed
    useEffect(() => {
        const baseSignals: Record<string, string> = { A: inputA, B: inputB };
        if (inputC) baseSignals.C = inputC;

        const newSignals = { ...baseSignals };
        let currentOutput = '';

        for (let i = 0; i < userCircuit.length; i++) {
            const step = userCircuit[i];
            const sig1 = newSignals[step.input1];
            const sig2 = step.input2 ? newSignals[step.input2] : undefined;

            if (!sig1 || (step.gate !== 'NOT' && !sig2)) {
                newSignals[`S${i}`] = '';
                continue;
            }

            const result = applyGate(step.gate, sig1, sig2);
            newSignals[`S${i}`] = result;
            currentOutput = result;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSignals(newSignals);

        if (currentOutput === targetOutput && currentOutput !== '') {
            const usedGates = userCircuit.map(s => s.gate);
            const allUsed = requiredGates.every(g => {
                const required = requiredGates.filter(x => x === g).length;
                const used = usedGates.filter(x => x === g).length;
                return used >= required;
            });
            setIsComplete(allUsed && usedGates.length === requiredGates.length);
        } else {
            setIsComplete(false);
        }
    }, [userCircuit, inputA, inputB, inputC, targetOutput, requiredGates, applyGate]);

    const addGate = useCallback((gate: GateType) => {
        const availableSignals = ['A', 'B'];
        if (inputC) availableSignals.push('C');
        for (let i = 0; i < userCircuit.length; i++) availableSignals.push(`S${i}`);

        const newStep: CircuitStep = {
            id: stepIdCounter,
            gate,
            input1: availableSignals[0],
            input2: gate !== 'NOT' ? availableSignals[Math.min(1, availableSignals.length - 1)] : undefined,
        };

        setUserCircuit([...userCircuit, newStep]);
        setStepIdCounter(prev => prev + 1);
    }, [userCircuit, inputC, stepIdCounter]);

    const updateInput = useCallback((stepId: number, inputNum: 1 | 2, value: string) => {
        setUserCircuit(prev => prev.map(step =>
          step.id === stepId ? { ...step, [inputNum === 1 ? 'input1' : 'input2']: value } : step
        ));
    }, []);

    // Remove single gate and update references
    const removeGate = useCallback((stepId: number) => {
        const idx = userCircuit.findIndex(s => s.id === stepId);
        if (idx === -1) return;

        const removedSignal = `S${idx}`;

        // Remove the gate and update subsequent gates' inputs
        const newCircuit = userCircuit
          .filter(s => s.id !== stepId)
          .map((step) => {
              let { input1, input2 } = step;

              // Update references to signals that were after the removed one
              const updateRef = (ref: string): string => {
                  if (ref === removedSignal) {
                      // Fall back to A if the reference was to the removed signal
                      return 'A';
                  }
                  if (ref.startsWith('S')) {
                      const refIdx = parseInt(ref.slice(1));
                      if (refIdx > idx) {
                          return `S${refIdx - 1}`;
                      }
                  }
                  return ref;
              };

              input1 = updateRef(input1);
              if (input2) input2 = updateRef(input2);

              return { ...step, input1, input2 };
          });

        setUserCircuit(newCircuit);
    }, [userCircuit]);

    const getAvailableSignals = useCallback((stepIndex: number): string[] => {
        const sigs = ['A', 'B'];
        if (inputC) sigs.push('C');
        for (let i = 0; i < stepIndex; i++) sigs.push(`S${i}`);
        return sigs;
    }, [inputC]);

    const gateUsage = useMemo(() => {
        const usage: Record<string, { required: number; used: number }> = {};
        requiredGates.forEach(g => {
            if (!usage[g]) usage[g] = { required: 0, used: 0 };
            usage[g].required++;
        });
        userCircuit.forEach(step => {
            if (usage[step.gate]) usage[step.gate].used++;
        });
        return usage;
    }, [requiredGates, userCircuit]);

    if (!mounted) {
        return (
          <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="text-zinc-700 font-mono text-xs tracking-widest">...</div>
          </div>
        );
    }

    return (
      <div className="min-h-screen bg-black text-white flex flex-col select-none">
          <main className="flex-1 flex flex-col items-center px-4 py-10 sm:py-16">

              {/* Header - Virgil style */}
              <header className="text-center mb-12">
                  <h1
                    className="text-3xl sm:text-4xl tracking-wide mb-2 text-zinc-100"
                    style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                  >
                      &quot;Logic_gate&quot;
                  </h1>
                  <div className="text-zinc-600 text-[10px] font-mono tracking-[0.3em] uppercase">
                      {isComplete ? 'verified' : 'pending'}
                  </div>
              </header>

              {/* Mode selector - minimal */}
              <div className="flex items-center gap-6 mb-12 text-xs tracking-widest">
                  {(['easy', 'medium', 'hard'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`
                transition-colors uppercase
                ${difficulty === d
                        ? 'text-white'
                        : 'text-zinc-700 hover:text-zinc-500'
                      }
              `}
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                        {d}
                    </button>
                  ))}
                  <span className="text-zinc-800">|</span>
                  <button
                    onClick={generatePuzzle}
                    className="text-zinc-600 hover:text-white transition-colors font-mono"
                  >
                      new
                  </button>
              </div>

              {/* Main content area */}
              <div className="w-full max-w-md space-y-8">

                  {/* Signals */}
                  <section>
                      <div
                        className="text-[10px] text-zinc-600 mb-4 tracking-widest"
                        style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                      >
                          &quot;Signals&quot;
                      </div>
                      <div className="space-y-1.5 pl-4 border-l border-zinc-900">
                          <BitRow bits={inputA} label="A" />
                          <BitRow bits={inputB} label="B" />
                          {difficulty === 'hard' && <BitRow bits={inputC} label="C" />}
                          <div className="h-3" />
                          <BitRow bits={targetOutput} label="target" variant="target" />
                      </div>
                  </section>

                  {/* Gates */}
                  <section>
                      <div
                        className="text-[10px] text-zinc-600 mb-4 tracking-widest"
                        style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                      >
                          &quot;Gates&quot;
                      </div>
                      <div className="flex flex-wrap gap-2 pl-4">
                          {Object.entries(gateUsage).map(([gate, { required, used }]) => {
                              const canAdd = used < required;
                              return (
                                <button
                                  key={gate}
                                  onClick={() => canAdd && addGate(gate as GateType)}
                                  disabled={!canAdd}
                                  className={`
                      px-3 py-1.5 font-mono text-xs tracking-wider transition-all border
                      ${canAdd
                                    ? 'text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50'
                                    : 'text-zinc-800 border-zinc-900 line-through cursor-not-allowed'
                                  }
                    `}
                                >
                                    {gate}
                                    <span className="ml-2 text-zinc-700">{used}/{required}</span>
                                </button>
                              );
                          })}
                      </div>
                  </section>

                  {/* Circuit */}
                  <section>
                      <div
                        className="text-[10px] text-zinc-600 mb-4 tracking-widest"
                        style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                      >
                          &quot;Circuit&quot;
                      </div>
                      <div className="pl-4 border-l border-zinc-900 min-h-[100px]">
                          {userCircuit.length === 0 ? (
                            <div className="text-zinc-800 text-xs font-mono py-8">
                                select gates to build
                            </div>
                          ) : (
                            <div className="space-y-3">
                                {userCircuit.map((step, idx) => {
                                    const availableSigs = getAvailableSignals(idx);
                                    const output = signals[`S${idx}`];
                                    const isLast = idx === userCircuit.length - 1;
                                    const matchesTarget = output === targetOutput;

                                    return (
                                      <div
                                        key={step.id}
                                        className="flex items-center gap-2 text-xs"
                                      >
                                          {/* Signal label */}
                                          <div
                                            className={`w-6 font-mono ${isLast && matchesTarget ? 'text-emerald-500' : 'text-cyan-600'}`}
                                          >
                                              S{idx}
                                          </div>

                                          <span className="text-zinc-700">=</span>

                                          {/* Input 1 */}
                                          <select
                                            value={step.input1}
                                            onChange={(e) => updateInput(step.id, 1, e.target.value)}
                                            className="bg-transparent text-zinc-400 border-b border-zinc-800 px-2 py-1 font-mono text-xs focus:outline-none focus:border-zinc-600 cursor-pointer w-12"
                                          >
                                              {availableSigs.map(sig => <option key={sig} value={sig} className="bg-black">{sig}</option>)}
                                          </select>

                                          {/* Gate */}
                                          <div className="px-2 py-1 text-amber-600 font-mono text-xs tracking-wider min-w-[50px] text-center">
                                              {step.gate}
                                          </div>

                                          {/* Input 2 */}
                                          {step.gate !== 'NOT' ? (
                                            <select
                                              value={step.input2}
                                              onChange={(e) => updateInput(step.id, 2, e.target.value)}
                                              className="bg-transparent text-zinc-400 border-b border-zinc-800 px-2 py-1 font-mono text-xs focus:outline-none focus:border-zinc-600 cursor-pointer w-12"
                                            >
                                                {availableSigs.map(sig => <option key={sig} value={sig} className="bg-black">{sig}</option>)}
                                            </select>
                                          ) : (
                                            <div className="w-12" />
                                          )}

                                          <span className="text-zinc-800 mx-1">→</span>

                                          {/* Output bits */}
                                          {output ? (
                                            <div className="flex">
                                                {output.split('').map((bit, i) => (
                                                  <div
                                                    key={i}
                                                    className={`
                                  w-4 h-5 flex items-center justify-center font-mono text-[10px]
                                  ${isLast && matchesTarget
                                                      ? bit === '1' ? 'bg-emerald-950/80 text-emerald-400' : 'bg-black text-zinc-800'
                                                      : bit === '1' ? 'bg-cyan-950/50 text-cyan-500' : 'bg-black text-zinc-800'
                                                    }
                                `}
                                                  >
                                                      {bit}
                                                  </div>
                                                ))}
                                            </div>
                                          ) : (
                                            <div className="text-zinc-800 font-mono text-[10px]">--------</div>
                                          )}

                                          {/* Delete */}
                                          <button
                                            onClick={() => removeGate(step.id)}
                                            className="ml-auto text-red-900 hover:text-red-500 transition-colors font-mono text-sm"
                                          >
                                              ×
                                          </button>
                                      </div>
                                    );
                                })}
                            </div>
                          )}
                      </div>
                  </section>

                  {/* Compare - only show when there's output */}
                  {userCircuit.length > 0 && signals[`S${userCircuit.length - 1}`] && (
                    <section>
                        <div
                          className="text-[10px] text-zinc-600 mb-4 tracking-widest"
                          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                        >
                            &quot;Compare&quot;
                        </div>
                        <div className="space-y-1.5 pl-4 border-l border-zinc-900">
                            <BitRow
                              bits={signals[`S${userCircuit.length - 1}`]}
                              label="yours"
                              variant={signals[`S${userCircuit.length - 1}`] === targetOutput ? 'target' : 'result'}
                            />
                            <BitRow bits={targetOutput} label="target" variant="dim" />
                        </div>
                    </section>
                  )}

              </div>
          </main>

          <footer className="pb-8 text-center">
              <p
                className="text-zinc-800 text-[10px] tracking-widest px-4"
                style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
              >
                  &quot;use all gates once&quot;
              </p>
          </footer>
      </div>
    );
}
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

type EdgeState = 'none' | 'line' | 'x';

export default function Slitherlink() {
  const [gridSize, setGridSize] = useState(5);
  const [hints, setHints] = useState<(number | null)[][]>([]);
  const [solutionEdges, setSolutionEdges] = useState<Set<string>>(new Set());
  const [playerEdges, setPlayerEdges] = useState<Map<string, EdgeState>>(new Map());
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Edge key helper
  const edgeKey = (row: number, col: number, type: 'h' | 'v') => `${type}-${row}-${col}`;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Timer
  useEffect(() => {
    if (!isComplete && moves > 0) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isComplete, moves]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Generate a valid closed loop using flood-fill based approach
  const generateLoop = useCallback((size: number): Set<string> => {
    const edges = new Set<string>();

    // Create a grid to mark inside/outside
    // We'll randomly create an "inside" region and the loop is its boundary
    const inside: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));

    // Start from center and grow the inside region
    const centerR = Math.floor(size / 2);
    const centerC = Math.floor(size / 2);
    inside[centerR][centerC] = true;

    // Grow the region randomly
    const targetSize = Math.floor(size * size * (0.3 + Math.random() * 0.4));
    let currentSize = 1;

    const getNeighbors = (r: number, c: number): [number, number][] => {
      const neighbors: [number, number][] = [];
      if (r > 0) neighbors.push([r - 1, c]);
      if (r < size - 1) neighbors.push([r + 1, c]);
      if (c > 0) neighbors.push([r, c - 1]);
      if (c < size - 1) neighbors.push([r, c + 1]);
      return neighbors;
    };

    // Keep track of boundary cells (cells that could expand)
    const boundary: [number, number][] = [[centerR, centerC]];

    while (currentSize < targetSize && boundary.length > 0) {
      // Pick a random boundary cell
      const idx = Math.floor(Math.random() * boundary.length);
      const [r, c] = boundary[idx];

      // Get unvisited neighbors
      const unvisited = getNeighbors(r, c).filter(([nr, nc]) => !inside[nr][nc]);

      if (unvisited.length === 0) {
        boundary.splice(idx, 1);
        continue;
      }

      // Add a random neighbor to the inside
      const [nr, nc] = unvisited[Math.floor(Math.random() * unvisited.length)];
      inside[nr][nc] = true;
      boundary.push([nr, nc]);
      currentSize++;
    }

    // Now create edges along the boundary of the inside region
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (inside[r][c]) {
          // Check top edge
          if (r === 0 || !inside[r - 1][c]) {
            edges.add(edgeKey(r, c, 'h'));
          }
          // Check bottom edge
          if (r === size - 1 || !inside[r + 1][c]) {
            edges.add(edgeKey(r + 1, c, 'h'));
          }
          // Check left edge
          if (c === 0 || !inside[r][c - 1]) {
            edges.add(edgeKey(r, c, 'v'));
          }
          // Check right edge
          if (c === size - 1 || !inside[r][c + 1]) {
            edges.add(edgeKey(r, c + 1, 'v'));
          }
        }
      }
    }

    // Verify the loop is valid (connected)
    if (edges.size < 4) {
      // Fallback to simple rectangle
      for (let i = 1; i < size - 1; i++) {
        edges.add(edgeKey(1, i, 'h'));
        edges.add(edgeKey(size - 1, i, 'h'));
        edges.add(edgeKey(i, 1, 'v'));
        edges.add(edgeKey(i, size - 1, 'v'));
      }
    }

    return edges;
  }, []);

  // Count edges around a cell
  const countEdgesAroundCell = useCallback((row: number, col: number, edges: Set<string>): number => {
    let count = 0;
    // Top edge
    if (edges.has(edgeKey(row, col, 'h'))) count++;
    // Bottom edge
    if (edges.has(edgeKey(row + 1, col, 'h'))) count++;
    // Left edge
    if (edges.has(edgeKey(row, col, 'v'))) count++;
    // Right edge
    if (edges.has(edgeKey(row, col + 1, 'v'))) count++;
    return count;
  }, []);

  // Generate hints based on solution
  const generateHints = useCallback((size: number, edges: Set<string>, diff: string): (number | null)[][] => {
    const allHints: number[][] = [];

    // Calculate all hints
    for (let r = 0; r < size; r++) {
      const row: number[] = [];
      for (let c = 0; c < size; c++) {
        row.push(countEdgesAroundCell(r, c, edges));
      }
      allHints.push(row);
    }

    // Remove some hints based on difficulty
    const hints: (number | null)[][] = allHints.map(row => [...row]);
    const removalRate = diff === 'easy' ? 0.2 : diff === 'medium' ? 0.4 : 0.55;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (Math.random() < removalRate) {
          hints[r][c] = null;
        }
      }
    }

    return hints;
  }, [countEdgesAroundCell]);

  // Generate new puzzle
  const generatePuzzle = useCallback((size: number) => {
    const loop = generateLoop(size);
    const newHints = generateHints(size, loop, difficulty);

    setSolutionEdges(loop);
    setHints(newHints);
    setPlayerEdges(new Map());
    setIsComplete(false);
    setMoves(0);
    setTimeElapsed(0);
  }, [generateLoop, generateHints, difficulty]);

  useEffect(() => {
    if (mounted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generatePuzzle(gridSize);
    }
  }, [gridSize, mounted, difficulty, generatePuzzle]);

  // Check if player has solved the puzzle
  const checkSolution = useCallback(() => {
    const playerLines = new Set<string>();
    playerEdges.forEach((state, key) => {
      if (state === 'line') playerLines.add(key);
    });

    // Check if sizes match
    if (playerLines.size !== solutionEdges.size) return false;

    // Check if all edges match
    for (const edge of solutionEdges) {
      if (!playerLines.has(edge)) return false;
    }

    return true;
  }, [playerEdges, solutionEdges]);

  // Check completion
  useEffect(() => {
    if (playerEdges.size > 0) {
      const solved = checkSolution();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsComplete(solved);
    }
  }, [playerEdges, checkSolution]);

  // Handle edge click
  const handleEdgeClick = useCallback((row: number, col: number, type: 'h' | 'v') => {
    if (isComplete) return;

    const key = edgeKey(row, col, type);
    const currentState = playerEdges.get(key) || 'none';

    const newState: EdgeState =
      currentState === 'none' ? 'line' :
        currentState === 'line' ? 'x' : 'none';

    const newEdges = new Map(playerEdges);
    if (newState === 'none') {
      newEdges.delete(key);
    } else {
      newEdges.set(key, newState);
    }

    setPlayerEdges(newEdges);
    if (currentState === 'none') {
      setMoves(prev => prev + 1);
    }
  }, [isComplete, playerEdges]);

  // Get current count for a cell (for validation display)
  const getCurrentCount = useCallback((row: number, col: number): number => {
    let count = 0;
    if (playerEdges.get(edgeKey(row, col, 'h')) === 'line') count++;
    if (playerEdges.get(edgeKey(row + 1, col, 'h')) === 'line') count++;
    if (playerEdges.get(edgeKey(row, col, 'v')) === 'line') count++;
    if (playerEdges.get(edgeKey(row, col + 1, 'v')) === 'line') count++;
    return count;
  }, [playerEdges]);

  // Check if a hint is satisfied, violated, or in progress
  const getHintStatus = useCallback((row: number, col: number): 'satisfied' | 'violated' | 'progress' => {
    const hint = hints[row]?.[col];
    if (hint === null || hint === undefined) return 'progress';

    const current = getCurrentCount(row, col);
    if (current === hint) return 'satisfied';
    if (current > hint) return 'violated';
    return 'progress';
  }, [hints, getCurrentCount]);

  const cellSize = useMemo(() => {
    if (gridSize <= 5) return { base: 52, sm: 64, lg: 72 };
    if (gridSize <= 7) return { base: 44, sm: 56, lg: 64 };
    return { base: 36, sm: 48, lg: 56 };
  }, [gridSize]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col select-none">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-8">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8">
          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-wide mb-3 italic"
            style={{ fontFamily: 'var(--font-serif, "Teodor", Georgia, serif)' }}
          >
            Slitherlink
          </h1>
          <p className="text-zinc-500 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium">
            Draw a single closed loop following the number clues
          </p>
        </header>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 lg:gap-14 mb-6 sm:mb-8">
          <div className="text-center min-w-[50px] sm:min-w-[70px]">
            <div className="text-zinc-500 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-1 font-medium">
              Size
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-semibold tabular-nums">
              {gridSize}×{gridSize}
            </div>
          </div>

          <div className="w-px h-8 bg-zinc-800" />

          <div className="text-center min-w-[50px] sm:min-w-[70px]">
            <div className="text-zinc-500 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-1 font-medium">
              Moves
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-semibold tabular-nums">
              {moves}
            </div>
          </div>

          <div className="w-px h-8 bg-zinc-800" />

          <div className="text-center min-w-[60px] sm:min-w-[80px]">
            <div className="text-zinc-500 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-1 font-medium">
              Time
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-semibold tabular-nums font-mono">
              {formatTime(timeElapsed)}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 sm:mb-8">
          {/* Size Selector */}
          <div className="flex items-center gap-1 p-1.5 bg-zinc-900/80 rounded-xl border border-zinc-800/50">
            {[5, 7, 10].map(size => (
              <button
                key={size}
                onClick={() => setGridSize(size)}
                className={`
                  px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold 
                  transition-all duration-300 ease-out
                  ${gridSize === size
                  ? 'bg-white text-black shadow-lg shadow-white/20 scale-105'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }
                `}
              >
                {size}×{size}
              </button>
            ))}
          </div>

          {/* Difficulty Selector */}
          <div className="flex items-center gap-1 p-1.5 bg-zinc-900/80 rounded-xl border border-zinc-800/50">
            {(['easy', 'medium', 'hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`
                  px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold 
                  transition-all duration-300 ease-out capitalize
                  ${difficulty === diff
                  ? 'bg-white text-black shadow-lg shadow-white/20 scale-105'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }
                `}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Victory Banner */}
        {isComplete && (
          <div
            className="mb-6 px-8 py-4 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500"
            style={{
              boxShadow: '0 0 40px rgba(52, 211, 153, 0.2), inset 0 0 40px rgba(52, 211, 153, 0.05)'
            }}
          >
            <p className="text-emerald-400 text-base sm:text-lg font-medium tracking-wide">
              ✓ Solved in {moves} moves · {formatTime(timeElapsed)}
            </p>
          </div>
        )}

        {/* Game Grid */}
        <div className="mb-8 sm:mb-10">
          <div
            className="relative p-4 sm:p-5"
            style={{
              width: `calc(${gridSize} * clamp(${cellSize.base}px, 8vw, ${cellSize.lg}px) + 2.5rem)`,
            }}
          >
            {/* Grid container */}
            <div
              className="relative"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridSize}, clamp(${cellSize.base}px, 8vw, ${cellSize.lg}px))`,
                gridTemplateRows: `repeat(${gridSize}, clamp(${cellSize.base}px, 8vw, ${cellSize.lg}px))`,
              }}
            >
              {/* Cells with hints */}
              {Array(gridSize).fill(0).map((_, row) =>
                Array(gridSize).fill(0).map((_, col) => {
                  const hint = hints[row]?.[col];
                  const status = getHintStatus(row, col);

                  return (
                    <div
                      key={`cell-${row}-${col}`}
                      className="flex items-center justify-center relative"
                    >
                      {hint !== null && hint !== undefined && (
                        <span
                          className={`
                            text-xl sm:text-2xl lg:text-3xl font-bold
                            transition-all duration-300 ease-out
                            ${status === 'satisfied'
                            ? 'text-emerald-400 scale-110'
                            : status === 'violated'
                              ? 'text-red-400 animate-pulse'
                              : 'text-zinc-200'}
                          `}
                          style={{
                            fontFamily: 'var(--font-sans, "Geist", system-ui, sans-serif)',
                            textShadow: status === 'satisfied'
                              ? '0 0 20px rgba(52, 211, 153, 0.5)'
                              : status === 'violated'
                                ? '0 0 20px rgba(248, 113, 113, 0.5)'
                                : 'none'
                          }}
                        >
                          {hint}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Dots at intersections */}
            {Array(gridSize + 1).fill(0).map((_, row) =>
              Array(gridSize + 1).fill(0).map((_, col) => (
                <div
                  key={`dot-${row}-${col}`}
                  className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-300"
                  style={{
                    left: `calc(${col} * clamp(${cellSize.base}px, 8vw, ${cellSize.lg}px) + 1rem)`,
                    top: `calc(${row} * clamp(${cellSize.base}px, 8vw, ${cellSize.lg}px) + 1rem)`,
                  }}
                />
              ))
            )}

            {/* Horizontal edges */}
            {Array(gridSize + 1).fill(0).map((_, row) =>
              Array(gridSize).fill(0).map((_, col) => {
                const state = playerEdges.get(edgeKey(row, col, 'h')) || 'none';

                return (
                  <button
                    key={`h-${row}-${col}`}
                    onClick={() => handleEdgeClick(row, col, 'h')}
                    disabled={isComplete}
                    className={`
                      absolute h-4 sm:h-5 flex items-center justify-center
                      transition-all duration-200 ease-out z-20
                      ${isComplete ? 'cursor-default' : 'cursor-pointer group'}
                    `}
                    style={{
                      left: `calc(${col} * clamp(${cellSize.base}px, 8vw, ${cellSize.lg}px) + 1rem + 4px)`,
                      top: `calc(${row} * clamp(${cellSize.base}px, 8vw, ${cellSize.lg}px) + 1rem - 8px)`,
                      width: `calc(clamp(${cellSize.base}px, 8vw, ${cellSize.lg}px) - 8px)`,
                    }}
                  >
                    <div
                      className={`
                        w-full rounded-full transition-all duration-300 ease-out
                        ${state === 'line'
                        ? 'h-1.5 sm:h-2 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8),0_0_24px_rgba(34,211,238,0.4)]'
                        : state === 'x'
                          ? 'h-0 bg-transparent'
                          : 'h-0.5 bg-zinc-800 group-hover:h-1 group-hover:bg-zinc-600'
                      }
                      `}
                    />
                    {state === 'x' && (
                      <span className="absolute text-zinc-600 text-sm font-bold transition-all duration-200">×</span>
                    )}
                  </button>
                );
              })
            )}

            {/* Vertical edges */}
            {Array(gridSize).fill(0).map((_, row) =>
              Array(gridSize + 1).fill(0).map((_, col) => {
                const state = playerEdges.get(edgeKey(row, col, 'v')) || 'none';

                return (
                  <button
                    key={`v-${row}-${col}`}
                    onClick={() => handleEdgeClick(row, col, 'v')}
                    disabled={isComplete}
                    className={`
                      absolute w-4 sm:w-5 flex items-center justify-center
                      transition-all duration-200 ease-out z-20
                      ${isComplete ? 'cursor-default' : 'cursor-pointer group'}
                    `}
                    style={{
                      left: `calc(${col} * clamp(${cellSize.base}px, 8vw, ${cellSize.lg}px) + 1rem - 8px)`,
                      top: `calc(${row} * clamp(${cellSize.base}px, 8vw, ${cellSize.lg}px) + 1rem + 4px)`,
                      height: `calc(clamp(${cellSize.base}px, 8vw, ${cellSize.lg}px) - 8px)`,
                    }}
                  >
                    <div
                      className={`
                        h-full rounded-full transition-all duration-300 ease-out
                        ${state === 'line'
                        ? 'w-1.5 sm:w-2 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8),0_0_24px_rgba(34,211,238,0.4)]'
                        : state === 'x'
                          ? 'w-0 bg-transparent'
                          : 'w-0.5 bg-zinc-800 group-hover:w-1 group-hover:bg-zinc-600'
                      }
                      `}
                    />
                    {state === 'x' && (
                      <span className="absolute text-zinc-600 text-sm font-bold transition-all duration-200">×</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => setPlayerEdges(new Map())}
            className="
              px-6 py-2.5 rounded-xl text-sm font-semibold
              border border-zinc-700 text-zinc-400
              hover:bg-zinc-900 hover:text-white hover:border-zinc-600
              hover:shadow-lg hover:shadow-zinc-900/50
              active:scale-95 transition-all duration-200 ease-out
            "
          >
            Clear
          </button>
          <button
            onClick={() => generatePuzzle(gridSize)}
            className="
              px-6 py-2.5 rounded-xl text-sm font-semibold
              bg-zinc-900 border border-zinc-700 text-zinc-200
              hover:bg-zinc-800 hover:text-white hover:border-zinc-500
              hover:shadow-lg hover:shadow-cyan-900/20
              active:scale-95 transition-all duration-200 ease-out
            "
          >
            New Puzzle
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-8 text-center">
        <p className="text-zinc-600 text-[11px] sm:text-xs tracking-wide max-w-md mx-auto leading-relaxed px-4 font-medium">
          Click edges to draw lines · Numbers show edges around each cell · Form one closed loop
        </p>
      </footer>
    </div>
  );
}
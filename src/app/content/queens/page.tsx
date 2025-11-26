'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

export default function ModernQueens() {
    const [gridSize, setGridSize] = useState(7);
    const [regions, setRegions] = useState<number[][]>([]);
    const [queens, setQueens] = useState<[number, number][]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [moves, setMoves] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [mounted, setMounted] = useState(false);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    // 洗練されたカラーパレット
    const regionColors = useMemo(() => [
        'hsl(210, 40%, 85%)',   // Soft blue
        'hsl(340, 35%, 85%)',   // Soft rose
        'hsl(160, 35%, 82%)',   // Soft mint
        'hsl(45, 45%, 85%)',    // Soft amber
        'hsl(270, 30%, 87%)',   // Soft lavender
        'hsl(190, 40%, 83%)',   // Soft cyan
        'hsl(25, 40%, 85%)',    // Soft peach
        'hsl(130, 30%, 84%)',   // Soft sage
        'hsl(0, 0%, 88%)',      // Soft gray
    ], []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isComplete && moves > 0) {
            intervalRef.current = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isComplete, moves]);

    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const solveNQueens = useCallback((n: number) => {
        const solutions: number[][] = [];
        const board = Array(n).fill(-1);

        const isSafe = (row: number, col: number) => {
            for (let i = 0; i < row; i++) {
                const prevCol = board[i];
                if (prevCol === col || Math.abs(prevCol - col) === Math.abs(i - row)) {
                    return false;
                }
            }
            return true;
        };

        const solve = (row: number) => {
            if (row === n) {
                solutions.push([...board]);
                return;
            }
            for (let col = 0; col < n; col++) {
                if (isSafe(row, col)) {
                    board[row] = col;
                    solve(row + 1);
                }
            }
        };

        solve(0);
        return solutions[Math.floor(Math.random() * solutions.length)];
    }, []);

    const generateRegions = useCallback((n: number, queenPositions: number[]) => {
        const regionMap = Array(n).fill(null).map(() => Array(n).fill(-1));
        const regionsArr: [number, number][][] = [];

        queenPositions.forEach((col, row) => {
            regionMap[row][col] = row;
            regionsArr.push([[row, col]]);
        });

        let unassigned = n * n - n;
        while (unassigned > 0) {
            for (let regionId = 0; regionId < n; regionId++) {
                if (unassigned === 0) break;

                const region = regionsArr[regionId];
                const candidates: [number, number][] = [];

                region.forEach(([r, c]) => {
                    const neighbors: [number, number][] = [[r-1,c], [r+1,c], [r,c-1], [r,c+1]];
                    neighbors.forEach(([nr, nc]) => {
                        if (nr >= 0 && nr < n && nc >= 0 && nc < n && regionMap[nr][nc] === -1) {
                            candidates.push([nr, nc]);
                        }
                    });
                });

                if (candidates.length > 0) {
                    const [newR, newC] = candidates[Math.floor(Math.random() * candidates.length)];
                    regionMap[newR][newC] = regionId;
                    region.push([newR, newC]);
                    unassigned--;
                }
            }
        }

        return regionMap;
    }, []);

    const generatePuzzle = useCallback((size: number) => {
        const queenSolution = solveNQueens(size);
        const regionMap = generateRegions(size, queenSolution);

        setRegions(regionMap);
        setQueens([]);
        setIsComplete(false);
        setErrors([]);
        setMoves(0);
        setTimeElapsed(0);
    }, [solveNQueens, generateRegions]);

    useEffect(() => {
        if (mounted) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            generatePuzzle(gridSize);
        }
    }, [gridSize, mounted, generatePuzzle]);

    const checkErrors = useCallback((currentQueens: [number, number][]) => {
        const errorSet = new Set<string>();

        currentQueens.forEach(([r1, c1], idx1) => {
            currentQueens.forEach(([r2, c2], idx2) => {
                if (idx1 !== idx2) {
                    if (r1 === r2 || c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2)) {
                        errorSet.add(`${r1}-${c1}`);
                        errorSet.add(`${r2}-${c2}`);
                    }
                }
            });
        });

        const regionQueenCount: Record<number, string[]> = {};
        currentQueens.forEach(([r, c]) => {
            if (regions[r] && regions[r][c] !== undefined) {
                const regionId = regions[r][c];
                if (!regionQueenCount[regionId]) {
                    regionQueenCount[regionId] = [];
                }
                regionQueenCount[regionId].push(`${r}-${c}`);
            }
        });

        Object.values(regionQueenCount).forEach(positions => {
            if (positions.length > 1) {
                positions.forEach(pos => errorSet.add(pos));
            }
        });

        setErrors(Array.from(errorSet));
        return errorSet.size === 0;
    }, [regions]);

    useEffect(() => {
        if (queens.length === gridSize) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            const noErrors = checkErrors(queens);

            const regionQueens = Array(gridSize).fill(0);
            queens.forEach(([r, c]) => {
                if (regions[r] && regions[r][c] !== undefined) {
                    regionQueens[regions[r][c]]++;
                }
            });

            const allRegionsValid = regionQueens.every(count => count === 1);
            setIsComplete(noErrors && allRegionsValid);
        } else {
            checkErrors(queens);
        }
    }, [queens, gridSize, regions, checkErrors]);

    const handleCellClick = useCallback((row: number, col: number) => {
        if (isComplete) return;

        const queenIndex = queens.findIndex(([r, c]) => r === row && c === col);

        if (queenIndex >= 0) {
            setQueens(queens.filter((_, idx) => idx !== queenIndex));
        } else {
            setQueens([...queens, [row, col]]);
            setMoves(prev => prev + 1);
        }
    }, [isComplete, queens]);

    // Crown SVG Component
    const CrownIcon = ({ isError, size }: { isError: boolean; size: number }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`transition-all duration-200 ${isError ? 'drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]' : 'drop-shadow-md'}`}
      >
          <path
            d="M2 17L4 8L8 12L12 4L16 12L20 8L22 17H2Z"
            fill={isError ? '#ef4444' : '#1a1a1a'}
            stroke={isError ? '#dc2626' : '#000'}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M4 20H20"
            stroke={isError ? '#dc2626' : '#000'}
            strokeWidth="2"
            strokeLinecap="round"
          />
      </svg>
    );

    if (!mounted) {
        return (
          <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
          </div>
        );
    }

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-8 lg:py-12">
              {/* Header */}
              <header className="text-center mb-6 sm:mb-10">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight mb-2">
                      Queens
                  </h1>
                  <p className="text-zinc-500 text-[10px] sm:text-xs tracking-[0.15em] uppercase">
                      One queen per region, row, column & diagonal
                  </p>
              </header>

              {/* Stats */}
              <div className="flex items-center justify-center gap-6 sm:gap-12 lg:gap-16 mb-6 sm:mb-10">
                  <div className="text-center min-w-[60px] sm:min-w-[80px]">
                      <div className="text-zinc-500 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-1.5">
                          Queens
                      </div>
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-extralight tabular-nums">
                          <span className="text-white">{queens.length}</span>
                          <span className="text-zinc-600">/{gridSize}</span>
                      </div>
                  </div>

                  <div className="w-px h-10 bg-zinc-800" />

                  <div className="text-center min-w-[60px] sm:min-w-[80px]">
                      <div className="text-zinc-500 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-1.5">
                          Moves
                      </div>
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-extralight tabular-nums">
                          {moves}
                      </div>
                  </div>

                  <div className="w-px h-10 bg-zinc-800" />

                  <div className="text-center min-w-[70px] sm:min-w-[90px]">
                      <div className="text-zinc-500 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-1.5">
                          Time
                      </div>
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-extralight tabular-nums font-mono">
                          {formatTime(timeElapsed)}
                      </div>
                  </div>
              </div>

              {/* Grid Size Selector */}
              <div className="flex items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 p-1 bg-zinc-900/50 rounded-lg">
                  {[5, 7, 9].map(size => (
                    <button
                      key={size}
                      onClick={() => setGridSize(size)}
                      className={`
                                px-4 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium 
                                transition-all duration-200 font-mono
                                ${gridSize === size
                        ? 'bg-white text-black shadow-lg'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                      }
                            `}
                    >
                        {size}×{size}
                    </button>
                  ))}
              </div>

              {/* Victory Banner */}
              {isComplete && (
                <div className="mb-6 sm:mb-8 px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full animate-in fade-in zoom-in duration-300">
                    <p className="text-emerald-400 text-sm sm:text-base font-light tracking-wide">
                        ✓ Solved in {moves} moves · {formatTime(timeElapsed)}
                    </p>
                </div>
              )}

              {/* Game Grid */}
              <div className="mb-6 sm:mb-8">
                  <div
                    className="inline-grid p-2 sm:p-3 bg-white/[0.03] rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/[0.05]"
                    style={{
                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                        gap: '0px',
                    }}
                  >
                      {Array(gridSize).fill(0).map((_, row) => (
                        Array(gridSize).fill(0).map((_, col) => {
                            const hasQueen = queens.some(([r, c]) => r === row && c === col);
                            const isError = errors.includes(`${row}-${col}`);
                            const regionId = regions[row]?.[col] ?? 0;

                            const getBorderWidth = (side: 'top' | 'bottom' | 'left' | 'right') => {
                                const checkRegion = (r: number, c: number) => regions[r]?.[c];
                                switch(side) {
                                    case 'top': return row === 0 || checkRegion(row-1, col) !== regionId ? 2 : 0.5;
                                    case 'bottom': return row === gridSize-1 || checkRegion(row+1, col) !== regionId ? 2 : 0.5;
                                    case 'left': return col === 0 || checkRegion(row, col-1) !== regionId ? 2 : 0.5;
                                    case 'right': return col === gridSize-1 || checkRegion(row, col+1) !== regionId ? 2 : 0.5;
                                }
                            };

                            return (
                              <button
                                key={`${row}-${col}`}
                                onClick={() => handleCellClick(row, col)}
                                disabled={isComplete}
                                className={`
                                            relative flex items-center justify-center
                                            transition-all duration-150 ease-out
                                            ${isComplete ? 'cursor-default' : 'cursor-pointer active:scale-95'}
                                            ${!isComplete && !hasQueen ? 'hover:brightness-95' : ''}
                                        `}
                                style={{
                                    width: 'clamp(36px, calc((100vw - 48px) / ' + gridSize + '), ' + (gridSize === 5 ? '64px' : gridSize === 7 ? '56px' : '48px') + ')',
                                    height: 'clamp(36px, calc((100vw - 48px) / ' + gridSize + '), ' + (gridSize === 5 ? '64px' : gridSize === 7 ? '56px' : '48px') + ')',
                                    backgroundColor: regionColors[regionId % regionColors.length],
                                    borderTopWidth: `${getBorderWidth('top')}px`,
                                    borderBottomWidth: `${getBorderWidth('bottom')}px`,
                                    borderLeftWidth: `${getBorderWidth('left')}px`,
                                    borderRightWidth: `${getBorderWidth('right')}px`,
                                    borderColor: 'rgba(0, 0, 0, 0.25)',
                                    borderStyle: 'solid',
                                }}
                              >
                                  {hasQueen && (
                                    <CrownIcon
                                      isError={isError}
                                      size={gridSize === 5 ? 28 : gridSize === 7 ? 24 : 20}
                                    />
                                  )}
                              </button>
                            );
                        })
                      ))}
                  </div>
              </div>

              {/* New Game Button */}
              <button
                onClick={() => generatePuzzle(gridSize)}
                className="
                        px-8 py-2.5 rounded-lg text-sm font-medium
                        border border-zinc-800 text-zinc-300
                        hover:bg-zinc-800/50 hover:text-white hover:border-zinc-700
                        active:scale-[0.98] transition-all duration-150
                    "
              >
                  New Puzzle
              </button>
          </main>

          {/* Footer Instructions */}
          <footer className="pb-6 sm:pb-8 text-center">
              <p className="text-zinc-600 text-[10px] sm:text-xs tracking-wide max-w-xs mx-auto leading-relaxed">
                  Tap cells to place queens · Each colored region, row, column, and diagonal must have exactly one queen
              </p>
          </footer>
      </div>
    );
}
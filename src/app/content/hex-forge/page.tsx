"use client";

import React from "react";
import { Virtuoso } from "react-virtuoso";
import { Upload, FileCode, Cpu, Search, Layers } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useHexEditor, BYTES_PER_ROW } from "./logic";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function HexEditorPage() {
  const {
    data,
    fileName,
    fileSize,
    selectedOffset,
    setSelectedOffset,
    hoverOffset,
    setHoverOffset,
    onInputChange,
    inspectorData,
  } = useHexEditor();

  const RowContent = (index: number) => {
    if (!data) return null;
    const startOffset = index * BYTES_PER_ROW;
    
    // 配列の切り出し (Array.fromを使わず高速化)
    const rowBytes: (number | null)[] = [];
    for (let i = 0; i < BYTES_PER_ROW; i++) {
        const offset = startOffset + i;
        rowBytes.push(offset < data.length ? data[offset] : null);
    }

    return (
      <div className="flex items-center h-6 text-sm font-mono select-none group">
        {/* Offset Address */}
        <div className="w-24 text-editor-muted flex-shrink-0 group-hover:text-white transition-colors pl-4 border-r border-editor-border/50">
          {startOffset.toString(16).toUpperCase().padStart(8, "0")}
        </div>

        {/* Hex Grid */}
        <div className="flex w-[400px] px-4 gap-1.5 flex-shrink-0">
          {rowBytes.map((byte, i) => {
            const currentOffset = startOffset + i;
            const isSelected = currentOffset === selectedOffset;
            const isHovered = currentOffset === hoverOffset;
            
            if (byte === null) return <span key={i} className="w-6" />;

            return (
              <span
                key={i}
                className={cn(
                  "w-6 text-center cursor-pointer rounded-[2px] transition-all duration-75",
                  isSelected 
                    ? "bg-blue-600 text-white font-bold shadow-[0_0_10px_rgba(37,99,235,0.5)] z-10 scale-110" 
                    : "text-editor-text",
                  !isSelected && isHovered ? "bg-white/10" : "",
                  i === 7 ? "mr-2" : "" // 8バイト目の区切り
                )}
                onMouseDown={() => setSelectedOffset(currentOffset)}
                onMouseEnter={() => setHoverOffset(currentOffset)}
                onMouseLeave={() => setHoverOffset(null)}
              >
                {byte.toString(16).toUpperCase().padStart(2, "0")}
              </span>
            );
          })}
        </div>

        {/* ASCII View */}
        <div className="flex flex-1 border-l border-editor-border/50 pl-4 opacity-75">
          {rowBytes.map((byte, i) => {
             const currentOffset = startOffset + i;
             const isSelected = currentOffset === selectedOffset;
             const isHovered = currentOffset === hoverOffset;

             if (byte === null) return null;
             // 制御文字はドット、それ以外を表示
             const char = byte >= 0x20 && byte <= 0x7E ? String.fromCharCode(byte) : ".";
             
             return (
               <span 
                key={i} 
                className={cn(
                  "w-3 text-center cursor-pointer transition-colors duration-75",
                  isSelected ? "bg-blue-600 text-white" : "text-editor-muted",
                  char !== "." ? "text-editor-text" : "opacity-30",
                  !isSelected && isHovered ? "bg-white/10 text-white" : ""
                )}
                onMouseDown={() => setSelectedOffset(currentOffset)}
                onMouseEnter={() => setHoverOffset(currentOffset)}
                onMouseLeave={() => setHoverOffset(null)}
               >
                 {char}
               </span>
             );
          })}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="flex flex-col h-screen bg-[#1a1a1a] text-[#e5e5e5] overflow-hidden selection:bg-blue-500/30"
      style={{
        fontFamily: 'var(--font-sans)', 
        "--font-sans": '"Geist", "Inter", "sans-serif"',
        "--font-mono": '"Geist Mono", monospace',
        "--font-serif": '"Teodor", "Georgia", serif',
      } as React.CSSProperties}
    >
      {/* 1. Header (Minimal) */}
      <header className="h-14 border-b border-[#333] flex items-center justify-between px-6 bg-[#1a1a1a] z-20">
        <div className="flex items-center gap-3">
            <div className="bg-white/5 p-1.5 rounded-md border border-white/10">
                <FileCode size={16} className="text-white" />
            </div>
            <h1 className="font-serif text-lg tracking-wide text-white">Hex<span className="text-[#666]">Forge</span></h1>
        </div>

        <div className="flex items-center gap-4">
            {fileName && (
                <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-[#888] bg-[#222] px-3 py-1 rounded border border-[#333]">
                    <span className="text-[#ccc]">{fileName}</span>
                    <span className="w-px h-3 bg-[#444]" />
                    <span>{fileSize.toLocaleString()} B</span>
                </div>
            )}
            <label className="cursor-pointer bg-white text-black hover:bg-gray-200 transition-colors px-3 py-1.5 rounded text-xs font-semibold tracking-wide flex items-center gap-2">
                <Upload size={14} />
                LOAD BINARY
                <input type="file" className="hidden" onChange={onInputChange} />
            </label>
        </div>
      </header>

      {/* 2. Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Hex Editor Area */}
        <div className="flex-1 flex flex-col relative bg-[#1a1a1a]">
          
          {/* Sticky Header for Columns */}
          <div className="h-8 flex items-center text-[10px] font-mono text-[#555] bg-[#1a1a1a] border-b border-[#333] select-none z-10 pl-24"> {/* pl-24 aligns with offset width */}
             <div className="flex w-[400px] px-4 gap-1.5">
               {Array.from({ length: 16 }).map((_, i) => (
                 <span key={i} className={cn("w-6 text-center", i === 7 ? "mr-2" : "")}>
                   {i.toString(16).toUpperCase().padStart(2, '0')}
                 </span>
               ))}
             </div>
             <div className="pl-4 border-l border-[#333] flex items-center gap-2">
                <Layers size={10} /> DECODED TEXT
             </div>
          </div>

          {/* Virtualized Grid */}
          <div className="flex-1">
            {data ? (
              <Virtuoso
                totalCount={Math.ceil(data.length / BYTES_PER_ROW)}
                itemContent={RowContent}
                className="no-scrollbar"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#444] gap-4">
                <div className="w-16 h-16 rounded-full bg-[#222] border border-[#333] flex items-center justify-center">
                    <Search size={24} className="opacity-50" />
                </div>
                <p className="font-serif text-lg opacity-50">Drop a file or click Load Binary</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Inspector Sidebar */}
        <aside className="w-[300px] bg-[#1c1c1c] border-l border-[#333] flex flex-col z-20 shadow-xl">
           <div className="h-8 flex items-center px-4 border-b border-[#333] bg-[#222] text-[10px] font-bold text-[#888] tracking-widest uppercase">
              <Cpu size={12} className="mr-2 inline" /> Inspector
           </div>
           
           <div className="flex-1 overflow-y-auto p-0 font-mono text-sm">
              {selectedOffset !== null ? (
                <div className="divide-y divide-[#333]">
                  {/* Meta Group */}
                  <div className="p-4 bg-[#222]">
                      <div className="text-[10px] text-[#666] mb-1">SELECTED OFFSET</div>
                      <div className="text-xl text-blue-400 font-medium tracking-tight">
                         0x{selectedOffset.toString(16).toUpperCase().padStart(8, '0')}
                      </div>
                  </div>

                  {/* Inspector Values */}
                  <div className="p-2 space-y-1">
                    {inspectorData.filter(d => d.category !== 'meta').map((item) => (
                        <div key={item.label} className="group flex justify-between items-center px-3 py-1.5 hover:bg-white/5 rounded transition-colors">
                            <span className="text-[#666] text-xs">{item.label}</span>
                            <span className="text-[#d4d4d4] select-all group-hover:text-white transition-colors">
                                {item.value}
                            </span>
                        </div>
                    ))}
                  </div>
                </div>
              ) : (
                 <div className="h-full flex flex-col items-center justify-center text-[#444] p-8 text-center">
                    <div className="mb-2">Click any byte</div>
                    <div className="text-xs opacity-50">to view detailed interpretation</div>
                 </div>
              )}
           </div>
           
           {/* Footer Info */}
           <div className="p-2 border-t border-[#333] text-[10px] text-[#555] text-center">
              LITTLE ENDIAN MODE
           </div>
        </aside>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function JacksonPollock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#0a0a0a');
  const [toolboxOpen, setToolboxOpen] = useState(true);

  const lastPoint = useRef<{ x: number; y: number; time: number } | null>(null);
  const velocity = useRef(0);
  const isDrawingRef = useRef(false);
  const baseBrushSize = 42; // 3x bigger for slow strokes

  const colors = [
    '#0a0a0a',
    '#1a1a4e',
    '#b91c1c',
    '#eab308',
    '#166534',
    '#ea580c',
    '#faf9f6',
  ];

  useEffect(() => {
    isDrawingRef.current = isDrawing;
  }, [isDrawing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const initCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.fillStyle = '#f5f0e6';
        ctx.fillRect(0, 0, rect.width, rect.height);
      }
    };

    initCanvas();
    // No resize handler - canvas stays fixed at initial size
  }, []);

  const drawStroke = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !lastPoint.current) return;

    const dx = x - lastPoint.current.x;
    const dy = y - lastPoint.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const dt = Math.max(1, Date.now() - lastPoint.current.time);
    const speed = distance / dt * 16;
    const angle = Math.atan2(dy, dx);

    // Smooth velocity
    velocity.current = velocity.current * 0.6 + speed * 0.4;

    // SLOW = VERY THICK, FAST = THIN
    // At rest: full size (42), at high speed: thin (6)
    const speedFactor = Math.max(0.15, 1 - velocity.current / 25);
    const dynamicSize = baseBrushSize * speedFactor;

    // Draw with multiple passes for brush texture
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Main stroke - slightly transparent for layering
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = dynamicSize;
    ctx.globalAlpha = 0.85;
    ctx.stroke();

    // Brush hair texture - thin lines along the stroke
    if (dynamicSize > 8) {
      const hairCount = Math.floor(dynamicSize / 4);
      for (let i = 0; i < hairCount; i++) {
        const offset = (i - hairCount / 2) * (dynamicSize / hairCount) * 0.7;
        const perpAngle = angle + Math.PI / 2;
        const ox = Math.cos(perpAngle) * offset;
        const oy = Math.sin(perpAngle) * offset;

        // Slight variation in each hair
        const wobble = (Math.random() - 0.5) * 2;

        ctx.beginPath();
        ctx.moveTo(lastPoint.current.x + ox + wobble, lastPoint.current.y + oy + wobble);
        ctx.lineTo(x + ox + wobble, y + oy + wobble);
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5 + Math.random() * 1;
        ctx.globalAlpha = 0.15 + Math.random() * 0.2;
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;

    // Edge bristle marks for thick strokes
    if (dynamicSize > 12 && distance > 3) {
      const edgeCount = Math.floor(distance / 4);
      for (let i = 0; i < edgeCount; i++) {
        if (Math.random() > 0.4) continue;
        const t = Math.random();
        const perpAngle = angle + Math.PI / 2;
        const edgeDist = (dynamicSize / 2) * (0.8 + Math.random() * 0.4);
        const side = Math.random() > 0.5 ? 1 : -1;
        const px = lastPoint.current.x + dx * t + Math.cos(perpAngle) * edgeDist * side;
        const py = lastPoint.current.y + dy * t + Math.sin(perpAngle) * edgeDist * side;

        ctx.beginPath();
        ctx.arc(px, py, 0.3 + Math.random() * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.2 + Math.random() * 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Splatters at high speed
    if (velocity.current > 15 && Math.random() < 0.35) {
      const count = Math.floor(Math.random() * 4) + 1;
      for (let i = 0; i < count; i++) {
        const spreadAngle = Math.random() * Math.PI * 2;
        const dist = velocity.current * (0.8 + Math.random() * 2.5);
        const sx = x + Math.cos(spreadAngle) * dist;
        const sy = y + Math.sin(spreadAngle) * dist;
        const size = 0.5 + Math.random() * 2.5;

        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.4 + Math.random() * 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    lastPoint.current = { x, y, time: Date.now() };
  }, [color]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    lastPoint.current = { x, y, time: Date.now() };
    velocity.current = 0;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Initial dot - like brush touching canvas
      ctx.beginPath();
      ctx.arc(x, y, baseBrushSize * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }, [color]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    drawStroke(x, y);
  }, [isDrawing, drawStroke]);

  const handlePointerUp = useCallback(() => {
    setIsDrawing(false);
    lastPoint.current = null;
    velocity.current = 0;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#f5f0e6';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  const exportCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `pollock_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f5f0e6',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: 'crosshair',
          touchAction: 'none',
        }}
      />

      <div style={{ position: 'absolute', top: 12, left: 12 }}>
        <button
          onClick={() => setToolboxOpen(!toolboxOpen)}
          style={{
            width: 28,
            height: 28,
            background: '#0a0a0a',
            color: '#f5f0e6',
            border: 'none',
            fontSize: 18,
            lineHeight: 1,
            cursor: 'pointer',
            fontFamily: 'Times New Roman, serif',
          }}
        >
          {toolboxOpen ? '−' : '+'}
        </button>

        {toolboxOpen && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: 28,
                    height: 28,
                    background: c,
                    border: color === c ? '2px solid #0a0a0a' : (c === '#faf9f6' ? '1px solid #ccc' : 'none'),
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button
                onClick={clearCanvas}
                style={{
                  width: 28,
                  height: 28,
                  background: 'none',
                  border: '1px solid #0a0a0a',
                  fontSize: 10,
                  cursor: 'pointer',
                  fontFamily: 'Times New Roman, serif',
                }}
              >
                C
              </button>
              <button
                onClick={exportCanvas}
                style={{
                  width: 28,
                  height: 28,
                  background: '#0a0a0a',
                  border: 'none',
                  color: '#f5f0e6',
                  fontSize: 10,
                  cursor: 'pointer',
                  fontFamily: 'Times New Roman, serif',
                }}
              >
                ↓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
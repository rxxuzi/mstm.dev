import { useState, useMemo, useCallback } from "react";

// --- Types ---
export type InspectorValue = {
  label: string;
  value: string | number;
  category: "integer" | "float" | "binary" | "meta";
};

// --- Constants ---
export const BYTES_PER_ROW = 16;

// --- Helper: Safe Data Reading ---
const safeRead = (fn: () => string | number): string | number => {
  try {
    return fn();
  } catch {
    return "N/A";
  }
};

export const useHexEditor = () => {
  const [data, setData] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [selectedOffset, setSelectedOffset] = useState<number | null>(null);
  const [hoverOffset, setHoverOffset] = useState<number | null>(null);

  const handleFileUpload = useCallback((file: File) => {
    setFileName(file.name);
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        setData(new Uint8Array(e.target.result));
        setSelectedOffset(null); // Reset selection
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const inspectorData = useMemo<InspectorValue[]>(() => {
    if (!data || selectedOffset === null) return [];
    
    // データ範囲外チェック
    if (selectedOffset >= data.byteLength) return [];

    const view = new DataView(data.buffer);

    return [
      { label: "Offset", value: `0x${selectedOffset.toString(16).toUpperCase().padStart(8, '0')}`, category: "meta" },
      { label: "Int8", value: safeRead(() => view.getInt8(selectedOffset)), category: "integer" },
      { label: "Uint8", value: safeRead(() => view.getUint8(selectedOffset)), category: "integer" },
      { label: "Int16 (LE)", value: safeRead(() => view.getInt16(selectedOffset, true)), category: "integer" },
      { label: "Uint16 (LE)", value: safeRead(() => view.getUint16(selectedOffset, true)), category: "integer" },
      { label: "Int32 (LE)", value: safeRead(() => view.getInt32(selectedOffset, true)), category: "integer" },
      { label: "Uint32 (LE)", value: safeRead(() => view.getUint32(selectedOffset, true)), category: "integer" },
      { label: "Float32", value: safeRead(() => view.getFloat32(selectedOffset, true).toFixed(6)), category: "float" },
      { label: "Float64", value: safeRead(() => view.getFloat64(selectedOffset, true).toFixed(12)), category: "float" },
      { 
        label: "Binary", 
        value: safeRead(() => view.getUint8(selectedOffset).toString(2).padStart(8, '0')), 
        category: "binary" 
      },
    ];
  }, [data, selectedOffset]);

  return {
    data,
    fileName,
    fileSize,
    selectedOffset,
    setSelectedOffset,
    hoverOffset,
    setHoverOffset,
    onInputChange,
    inspectorData,
  };
};
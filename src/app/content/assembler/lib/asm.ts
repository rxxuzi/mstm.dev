// lib/asm.ts
import { Opcode, REGISTERS, RegisterName } from './isa';

type LabelMap = { [key: string]: number };

export interface AssemblyResult {
  machineCode: Uint8Array;
  sourceMap: number[];
  labels: LabelMap;
  error: string | null;
}

const isRegister = (s: string): s is RegisterName => {
  if (!s) return false;
  const upper = s.toUpperCase();
  return (REGISTERS as readonly string[]).includes(upper);
};

const getInstructionSize = (mnemonic: string, args: string[], line: string): number => {
  const op = mnemonic.toUpperCase();

  // DB: variable size
  if (op === 'DB') {
    const strMatch = line.match(/"(.*)"/);
    if (strMatch) return strMatch[1].length;
    return line.substring(line.toUpperCase().indexOf('DB') + 2).split(',').length;
  }

  // 1-byte instructions (no operands)
  if (['RET', 'HLT', 'NOP'].includes(op)) return 1;

  // 2-byte instructions (1 operand)
  if (['INC', 'DEC', 'PUSH', 'POP', 'JMP', 'CALL', 'JZ', 'JNZ', 'JC', 'JNC'].includes(op)) return 2;

  // 3-byte instructions (2 operands)
  return 3;
};

export function assemble(source: string): AssemblyResult {
  const lines = source.split('\n');
  const machineCode = new Uint8Array(256).fill(0);
  const sourceMap = new Array(256).fill(-1);
  const labels: LabelMap = {};

  // Remove comments and trim
  const cleanLines = lines.map(l => {
    const commentIdx = l.indexOf(';');
    return commentIdx >= 0 ? l.substring(0, commentIdx).trim() : l.trim();
  });

  let addr = 0;

  // ============== PASS 1: Calculate Label Addresses ==============
  for (let i = 0; i < cleanLines.length; i++) {
    let line = cleanLines[i];
    if (!line) continue;

    // Check for label definition (supports .loop style labels)
    const labelMatch = line.match(/^(\.?[a-zA-Z_][a-zA-Z0-9_.]*)\s*:/);
    if (labelMatch) {
      labels[labelMatch[1]] = addr;
      line = line.substring(labelMatch[0].length).trim();
      if (!line) continue;
    }

    // Parse instruction
    const parts = line.match(/(\.?[a-zA-Z_][a-zA-Z0-9_.]*)|"[^"]*"|\[[^\]]*\]|[0-9]+/g) || [];
    if (parts.length === 0 || !parts[0]) continue;

    addr += getInstructionSize(parts[0], parts.slice(1), line);
  }

  // ============== PASS 2: Generate Machine Code ==============
  addr = 0;

  for (let i = 0; i < cleanLines.length; i++) {
    let line = cleanLines[i];
    if (!line) continue;

    // Check for label and remove it from line
    const labelMatch = line.match(/^(\.?[a-zA-Z_][a-zA-Z0-9_.]*)\s*:/);
    if (labelMatch) {
      line = line.substring(labelMatch[0].length).trim();
    }
    if (!line) continue;

    // Record source mapping
    sourceMap[addr] = i;

    // Parse instruction and operands
    // Match: identifiers, quoted strings, or bracketed expressions
    const parts = line.match(/(\.?[a-zA-Z_][a-zA-Z0-9_.]*)|"[^"]*"|\[[^\]]*\]|[0-9]+/g) || [];
    if (parts.length === 0 || !parts[0]) continue;

    const op = parts[0].toUpperCase();
    const arg1 = parts[1];
    const arg2 = parts[2];

    // Helper: resolve value (label or number)
    const getVal = (v: string): number => {
      if (!v) return 0;
      // Check if it's a label (exact match first)
      if (v in labels) return labels[v];
      // Check case-insensitive for labels
      for (const [key, val] of Object.entries(labels)) {
        if (key.toLowerCase() === v.toLowerCase()) return val;
      }
      // Parse as number
      const num = parseInt(v);
      return isNaN(num) ? 0 : num;
    };

    // Helper: get register code (0-3 for A-D)
    const getRegCode = (r: string): number => {
      if (!r) return 0;
      const upper = r.toUpperCase();
      const idx = (REGISTERS as readonly string[]).indexOf(upper);
      return idx >= 0 ? idx : 0;
    };

    // Helper: check if argument is indirect [R]
    const isIndirect = (s: string): boolean => {
      if (!s) return false;
      return s.startsWith('[') && s.endsWith(']');
    };

    // Helper: extract register from [R]
    const getIndirectReg = (s: string): string => {
      if (!s) return '';
      return s.replace('[', '').replace(']', '').trim();
    };

    // Helper: check if arg is register
    const argIsRegister = (s: string): boolean => {
      if (!s) return false;
      if (isIndirect(s)) return false;
      return isRegister(s);
    };

    try {
      // ============== DB (Define Byte) ==============
      if (op === 'DB') {
        const strMatch = line.match(/"(.*)"/);
        if (strMatch) {
          // String literal
          for (const char of strMatch[1]) {
            machineCode[addr++] = char.charCodeAt(0);
          }
        } else {
          // Numeric values
          const dbIndex = line.toUpperCase().indexOf('DB');
          const nums = line.substring(dbIndex + 2)
            .split(',')
            .map(s => parseInt(s.trim()));
          nums.forEach(n => machineCode[addr++] = isNaN(n) ? 0 : n & 0xFF);
        }
        continue;
      }

      // ============== Instructions ==============
      switch (op) {
        // --- No Operation ---
        case 'NOP':
          machineCode[addr++] = Opcode.NOP;
          break;

        // --- MOV variants ---
        case 'MOV':
          if (argIsRegister(arg1) && argIsRegister(arg2)) {
            // MOV R, R
            machineCode[addr++] = Opcode.MOV_R_R;
            machineCode[addr++] = getRegCode(arg1);
            machineCode[addr++] = getRegCode(arg2);
          } else if (argIsRegister(arg1) && isIndirect(arg2)) {
            // MOV R, [R]
            machineCode[addr++] = Opcode.MOV_R_MR;
            machineCode[addr++] = getRegCode(arg1);
            machineCode[addr++] = getRegCode(getIndirectReg(arg2));
          } else if (isIndirect(arg1) && argIsRegister(arg2)) {
            // MOV [R], R
            machineCode[addr++] = Opcode.MOV_MR_R;
            machineCode[addr++] = getRegCode(getIndirectReg(arg1));
            machineCode[addr++] = getRegCode(arg2);
          } else if (argIsRegister(arg1)) {
            // MOV R, Imm
            machineCode[addr++] = Opcode.MOV_R_IMM;
            machineCode[addr++] = getRegCode(arg1);
            machineCode[addr++] = getVal(arg2);
          } else {
            throw new Error(`Invalid MOV arguments: ${arg1}, ${arg2}`);
          }
          break;

        // --- ADD ---
        case 'ADD':
          if (argIsRegister(arg1) && argIsRegister(arg2)) {
            machineCode[addr++] = Opcode.ADD_R_R;
            machineCode[addr++] = getRegCode(arg1);
            machineCode[addr++] = getRegCode(arg2);
          } else if (argIsRegister(arg1)) {
            machineCode[addr++] = Opcode.ADD;
            machineCode[addr++] = getRegCode(arg1);
            machineCode[addr++] = getVal(arg2);
          } else {
            throw new Error(`Invalid ADD arguments: ${arg1}, ${arg2}`);
          }
          break;

        // --- SUB ---
        case 'SUB':
          if (argIsRegister(arg1) && argIsRegister(arg2)) {
            machineCode[addr++] = Opcode.SUB_R_R;
            machineCode[addr++] = getRegCode(arg1);
            machineCode[addr++] = getRegCode(arg2);
          } else if (argIsRegister(arg1)) {
            machineCode[addr++] = Opcode.SUB;
            machineCode[addr++] = getRegCode(arg1);
            machineCode[addr++] = getVal(arg2);
          } else {
            throw new Error(`Invalid SUB arguments: ${arg1}, ${arg2}`);
          }
          break;

        // --- MUL ---
        case 'MUL':
          if (argIsRegister(arg1) && argIsRegister(arg2)) {
            machineCode[addr++] = Opcode.MUL_R_R;
            machineCode[addr++] = getRegCode(arg1);
            machineCode[addr++] = getRegCode(arg2);
          } else if (argIsRegister(arg1)) {
            machineCode[addr++] = Opcode.MUL;
            machineCode[addr++] = getRegCode(arg1);
            machineCode[addr++] = getVal(arg2);
          } else {
            throw new Error(`Invalid MUL arguments: ${arg1}, ${arg2}`);
          }
          break;

        // --- DIV ---
        case 'DIV':
          if (argIsRegister(arg1) && argIsRegister(arg2)) {
            machineCode[addr++] = Opcode.DIV_R_R;
            machineCode[addr++] = getRegCode(arg1);
            machineCode[addr++] = getRegCode(arg2);
          } else if (argIsRegister(arg1)) {
            machineCode[addr++] = Opcode.DIV;
            machineCode[addr++] = getRegCode(arg1);
            machineCode[addr++] = getVal(arg2);
          } else {
            throw new Error(`Invalid DIV arguments: ${arg1}, ${arg2}`);
          }
          break;

        // --- MOD ---
        case 'MOD':
          if (argIsRegister(arg1) && argIsRegister(arg2)) {
            machineCode[addr++] = Opcode.MOD_R_R;
            machineCode[addr++] = getRegCode(arg1);
            machineCode[addr++] = getRegCode(arg2);
          } else if (argIsRegister(arg1)) {
            machineCode[addr++] = Opcode.MOD;
            machineCode[addr++] = getRegCode(arg1);
            machineCode[addr++] = getVal(arg2);
          } else {
            throw new Error(`Invalid MOD arguments: ${arg1}, ${arg2}`);
          }
          break;

        // --- CMP ---
        case 'CMP':
          if (argIsRegister(arg1) && argIsRegister(arg2)) {
            machineCode[addr++] = Opcode.CMP_R_R;
            machineCode[addr++] = getRegCode(arg1);
            machineCode[addr++] = getRegCode(arg2);
          } else if (argIsRegister(arg1)) {
            machineCode[addr++] = Opcode.CMP;
            machineCode[addr++] = getRegCode(arg1);
            machineCode[addr++] = getVal(arg2);
          } else {
            throw new Error(`Invalid CMP arguments: ${arg1}, ${arg2}`);
          }
          break;

        // --- INC / DEC ---
        case 'INC':
          machineCode[addr++] = Opcode.INC;
          machineCode[addr++] = getRegCode(arg1);
          break;

        case 'DEC':
          machineCode[addr++] = Opcode.DEC;
          machineCode[addr++] = getRegCode(arg1);
          break;

        // --- PUSH / POP ---
        case 'PUSH':
          machineCode[addr++] = Opcode.PUSH;
          machineCode[addr++] = getRegCode(arg1);
          break;

        case 'POP':
          machineCode[addr++] = Opcode.POP;
          machineCode[addr++] = getRegCode(arg1);
          break;

        // --- Jumps ---
        case 'JMP':
          machineCode[addr++] = Opcode.JMP;
          machineCode[addr++] = getVal(arg1);
          break;

        case 'JZ':
          machineCode[addr++] = Opcode.JZ;
          machineCode[addr++] = getVal(arg1);
          break;

        case 'JNZ':
          machineCode[addr++] = Opcode.JNZ;
          machineCode[addr++] = getVal(arg1);
          break;

        case 'JC':
          machineCode[addr++] = Opcode.JC;
          machineCode[addr++] = getVal(arg1);
          break;

        case 'JNC':
          machineCode[addr++] = Opcode.JNC;
          machineCode[addr++] = getVal(arg1);
          break;

        // --- CALL / RET ---
        case 'CALL':
          machineCode[addr++] = Opcode.CALL;
          machineCode[addr++] = getVal(arg1);
          break;

        case 'RET':
          machineCode[addr++] = Opcode.RET;
          break;

        // --- HLT ---
        case 'HLT':
          machineCode[addr++] = Opcode.HLT;
          break;

        default:
          // Unknown instruction - treat as NOP but log warning
          console.warn(`Unknown instruction: ${op}`);
          machineCode[addr++] = Opcode.NOP;
          break;
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      return { machineCode, sourceMap, labels, error: `Error line ${i + 1}: ${errorMsg}` };
    }
  }

  return { machineCode, sourceMap, labels, error: null };
}
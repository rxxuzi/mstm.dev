// lib/cpu.ts
import { Opcode, MEM_SIZE, OUTPUT_PORT } from './isa';

export type CpuState = {
  regs: number[];   // A, B, C, D
  ip: number;       // Instruction Pointer
  sp: number;       // Stack Pointer
  flags: {
    z: boolean;     // Zero flag
    c: boolean;     // Carry flag
    f: boolean;     // Fault flag
  };
  halted: boolean;
};

export const INITIAL_STATE: CpuState = {
  regs: [0, 0, 0, 0],
  ip: 0,
  sp: MEM_SIZE - 1,
  flags: { z: false, c: false, f: false },
  halted: false,
};

/**
 * Execute one CPU cycle
 * Returns new state, new memory, and any output character
 */
export function stepWithMem(
  state: CpuState,
  mem: Uint8Array
): { newState: CpuState; newMem: Uint8Array; outChar: string | null } {

  // Already halted - no operation
  if (state.halted) {
    return { newState: state, newMem: mem, outChar: null };
  }

  // Clone state and memory for immutability (important for React)
  const s: CpuState = {
    ...state,
    regs: [...state.regs],
    flags: { ...state.flags },
  };
  const m = new Uint8Array(mem);

  let outChar: string | null = null;

  // Check bounds
  if (s.ip >= MEM_SIZE) {
    s.halted = true;
    return { newState: s, newMem: m, outChar: null };
  }

  // Fetch opcode
  const op = m[s.ip++];

  // Helper: set Zero flag based on value
  const setZ = (val: number): void => {
    s.flags.z = (val & 0xFF) === 0;
  };

  // Helper: set Carry flag for subtraction (borrow)
  const setCarry = (result: number): void => {
    s.flags.c = result < 0;
  };

  // ============== Execute Instruction ==============
  switch (op) {
    // --- NOP ---
    case Opcode.NOP:
      // Do nothing
      break;

    // --- MOV R, Imm ---
    case Opcode.MOV_R_IMM: {
      const reg = m[s.ip++];
      const val = m[s.ip++];
      s.regs[reg] = val;
      break;
    }

    // --- MOV R, R ---
    case Opcode.MOV_R_R: {
      const dest = m[s.ip++];
      const src = m[s.ip++];
      s.regs[dest] = s.regs[src];
      break;
    }

    // --- MOV R, [R] (Load from memory) ---
    case Opcode.MOV_R_MR: {
      const dest = m[s.ip++];
      const ptr = m[s.ip++];
      const addr = s.regs[ptr];
      s.regs[dest] = m[addr];
      break;
    }

    // --- MOV [R], R (Store to memory) ---
    case Opcode.MOV_MR_R: {
      const ptr = m[s.ip++];
      const src = m[s.ip++];
      const addr = s.regs[ptr];
      m[addr] = s.regs[src];
      // Check if writing to output port
      if (addr === OUTPUT_PORT) {
        outChar = String.fromCharCode(s.regs[src]);
      }
      break;
    }

    // --- ADD R, Imm ---
    case Opcode.ADD: {
      const reg = m[s.ip++];
      const val = m[s.ip++];
      const result = s.regs[reg] + val;
      s.regs[reg] = result & 0xFF;
      setZ(s.regs[reg]);
      s.flags.c = result > 255;
      break;
    }

    // --- ADD R, R ---
    case Opcode.ADD_R_R: {
      const dest = m[s.ip++];
      const src = m[s.ip++];
      const result = s.regs[dest] + s.regs[src];
      s.regs[dest] = result & 0xFF;
      setZ(s.regs[dest]);
      s.flags.c = result > 255;
      break;
    }

    // --- SUB R, Imm ---
    case Opcode.SUB: {
      const reg = m[s.ip++];
      const val = m[s.ip++];
      const result = s.regs[reg] - val;
      s.regs[reg] = result & 0xFF;
      setZ(s.regs[reg]);
      setCarry(result);
      break;
    }

    // --- SUB R, R ---
    case Opcode.SUB_R_R: {
      const dest = m[s.ip++];
      const src = m[s.ip++];
      const result = s.regs[dest] - s.regs[src];
      s.regs[dest] = result & 0xFF;
      setZ(s.regs[dest]);
      setCarry(result);
      break;
    }

    // --- MUL R, Imm ---
    case Opcode.MUL: {
      const reg = m[s.ip++];
      const val = m[s.ip++];
      const result = s.regs[reg] * val;
      s.regs[reg] = result & 0xFF;
      setZ(s.regs[reg]);
      s.flags.c = result > 255; // Overflow
      break;
    }

    // --- MUL R, R ---
    case Opcode.MUL_R_R: {
      const dest = m[s.ip++];
      const src = m[s.ip++];
      const result = s.regs[dest] * s.regs[src];
      s.regs[dest] = result & 0xFF;
      setZ(s.regs[dest]);
      s.flags.c = result > 255;
      break;
    }

    // --- DIV R, Imm ---
    case Opcode.DIV: {
      const reg = m[s.ip++];
      const val = m[s.ip++];
      if (val === 0) {
        s.flags.f = true; // Division by zero fault
      } else {
        s.regs[reg] = Math.floor(s.regs[reg] / val) & 0xFF;
        setZ(s.regs[reg]);
      }
      break;
    }

    // --- DIV R, R ---
    case Opcode.DIV_R_R: {
      const dest = m[s.ip++];
      const src = m[s.ip++];
      if (s.regs[src] === 0) {
        s.flags.f = true; // Division by zero fault
      } else {
        s.regs[dest] = Math.floor(s.regs[dest] / s.regs[src]) & 0xFF;
        setZ(s.regs[dest]);
      }
      break;
    }

    // --- MOD R, Imm ---
    case Opcode.MOD: {
      const reg = m[s.ip++];
      const val = m[s.ip++];
      if (val === 0) {
        s.flags.f = true; // Division by zero fault
      } else {
        s.regs[reg] = (s.regs[reg] % val) & 0xFF;
        setZ(s.regs[reg]);
      }
      break;
    }

    // --- MOD R, R ---
    case Opcode.MOD_R_R: {
      const dest = m[s.ip++];
      const src = m[s.ip++];
      if (s.regs[src] === 0) {
        s.flags.f = true; // Division by zero fault
      } else {
        s.regs[dest] = (s.regs[dest] % s.regs[src]) & 0xFF;
        setZ(s.regs[dest]);
      }
      break;
    }

    // --- INC R ---
    case Opcode.INC: {
      const reg = m[s.ip++];
      s.regs[reg] = (s.regs[reg] + 1) & 0xFF;
      setZ(s.regs[reg]);
      break;
    }

    // --- DEC R ---
    case Opcode.DEC: {
      const reg = m[s.ip++];
      const result = s.regs[reg] - 1;
      s.regs[reg] = result & 0xFF;
      setZ(s.regs[reg]);
      setCarry(result);
      break;
    }

    // --- CMP R, Imm ---
    case Opcode.CMP: {
      const reg = m[s.ip++];
      const val = m[s.ip++];
      const result = s.regs[reg] - val;
      setZ(result & 0xFF);
      setCarry(result);
      break;
    }

    // --- CMP R, R ---
    case Opcode.CMP_R_R: {
      const reg1 = m[s.ip++];
      const reg2 = m[s.ip++];
      const result = s.regs[reg1] - s.regs[reg2];
      setZ(result & 0xFF);
      setCarry(result);
      break;
    }

    // --- JMP Label ---
    case Opcode.JMP: {
      const target = m[s.ip++];
      s.ip = target;
      break;
    }

    // --- JZ Label (Jump if Zero) ---
    case Opcode.JZ: {
      const target = m[s.ip++];
      if (s.flags.z) {
        s.ip = target;
      }
      break;
    }

    // --- JNZ Label (Jump if Not Zero) ---
    case Opcode.JNZ: {
      const target = m[s.ip++];
      if (!s.flags.z) {
        s.ip = target;
      }
      break;
    }

    // --- JC Label (Jump if Carry) ---
    case Opcode.JC: {
      const target = m[s.ip++];
      if (s.flags.c) {
        s.ip = target;
      }
      break;
    }

    // --- JNC Label (Jump if Not Carry) ---
    case Opcode.JNC: {
      const target = m[s.ip++];
      if (!s.flags.c) {
        s.ip = target;
      }
      break;
    }

    // --- CALL Label ---
    case Opcode.CALL: {
      const target = m[s.ip++];
      // Push return address onto stack
      m[s.sp] = s.ip;
      s.sp = (s.sp - 1) & 0xFF;
      s.ip = target;
      break;
    }

    // --- RET ---
    case Opcode.RET: {
      // Pop return address from stack
      s.sp = (s.sp + 1) & 0xFF;
      s.ip = m[s.sp];
      break;
    }

    // --- PUSH R ---
    case Opcode.PUSH: {
      const reg = m[s.ip++];
      m[s.sp] = s.regs[reg];
      s.sp = (s.sp - 1) & 0xFF;
      break;
    }

    // --- POP R ---
    case Opcode.POP: {
      const reg = m[s.ip++];
      s.sp = (s.sp + 1) & 0xFF;
      s.regs[reg] = m[s.sp];
      break;
    }

    // --- HLT ---
    case Opcode.HLT:
      s.halted = true;
      break;

    // --- Unknown Opcode ---
    default:
      s.flags.f = true; // Set fault flag
      console.warn(`Unknown opcode: 0x${op.toString(16).toUpperCase()}`);
      break;
  }

  // Ensure stack pointer wraps around
  s.sp &= 0xFF;

  return { newState: s, newMem: m, outChar };
}

/**
 * Legacy step function (doesn't return memory)
 * Kept for backward compatibility
 */
export function step(
  state: CpuState,
  mem: Uint8Array
): { newState: CpuState; outChar: string | null } {
  const { newState, outChar } = stepWithMem(state, mem);
  return { newState, outChar };
}
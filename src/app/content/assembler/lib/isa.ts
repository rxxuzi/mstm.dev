// lib/isa.ts

export enum Opcode {
  NOP = 0x00,       // No Operation

  // MOV variants
  MOV_R_IMM = 0x10, // MOV R, Imm
  MOV_R_R   = 0x11, // MOV R, R
  MOV_R_MR  = 0x12, // MOV R, [R]
  MOV_MR_R  = 0x13, // MOV [R], R

  // Arithmetic
  ADD     = 0x20,   // ADD R, Imm
  SUB     = 0x21,   // SUB R, Imm
  INC     = 0x22,   // INC R
  DEC     = 0x23,   // DEC R
  CMP     = 0x24,   // CMP R, Imm
  ADD_R_R = 0x25,   // ADD R, R
  SUB_R_R = 0x26,   // SUB R, R
  MUL     = 0x27,   // MUL R, Imm
  DIV     = 0x28,   // DIV R, Imm
  MOD     = 0x29,   // MOD R, Imm
  MUL_R_R = 0x2A,   // MUL R, R
  DIV_R_R = 0x2B,   // DIV R, R
  MOD_R_R = 0x2C,   // MOD R, R
  CMP_R_R = 0x2D,   // CMP R, R

  // Jumps
  JMP = 0x30,       // JMP Label
  JZ  = 0x31,       // JZ Label (Jump if Zero)
  JNZ = 0x32,       // JNZ Label (Jump if Not Zero)
  JC  = 0x33,       // JC Label (Jump if Carry)
  JNC = 0x34,       // JNC Label (Jump if Not Carry)

  // Stack & Subroutines
  PUSH = 0x40,      // PUSH R
  POP  = 0x41,      // POP R
  CALL = 0x42,      // CALL Label
  RET  = 0x43,      // RET

  // Halt
  HLT = 0xFF        // Halt execution
}

export const REGISTERS = ['A', 'B', 'C', 'D'] as const;
export type RegisterName = typeof REGISTERS[number];
export const MEM_SIZE = 256;
export const OUTPUT_PORT = 232;

// UI Documentation
export const INSTRUCTION_SET_DOCS = [
  { id: "nop", mnemonic: "NOP", args: "-", desc: "No Operation" },
  { id: "mov_r_imm", mnemonic: "MOV", args: "R, Imm", desc: "Move value into register" },
  { id: "mov_r_r", mnemonic: "MOV", args: "R, R", desc: "Copy register to register" },
  { id: "mov_r_mr", mnemonic: "MOV", args: "R, [R]", desc: "Load from memory (indirect)" },
  { id: "mov_mr_r", mnemonic: "MOV", args: "[R], R", desc: "Store to memory (indirect)" },
  { id: "add", mnemonic: "ADD", args: "R, Imm", desc: "Add value to register" },
  { id: "add_r_r", mnemonic: "ADD", args: "R, R", desc: "Add register to register" },
  { id: "sub", mnemonic: "SUB", args: "R, Imm", desc: "Subtract value from register" },
  { id: "sub_r_r", mnemonic: "SUB", args: "R, R", desc: "Subtract register from register" },
  { id: "mul", mnemonic: "MUL", args: "R, Imm", desc: "Multiply register by value" },
  { id: "mul_r_r", mnemonic: "MUL", args: "R, R", desc: "Multiply register by register" },
  { id: "div", mnemonic: "DIV", args: "R, Imm", desc: "Divide register by value" },
  { id: "div_r_r", mnemonic: "DIV", args: "R, R", desc: "Divide register by register" },
  { id: "mod", mnemonic: "MOD", args: "R, Imm", desc: "Remainder of division" },
  { id: "mod_r_r", mnemonic: "MOD", args: "R, R", desc: "Remainder (register divisor)" },
  { id: "inc", mnemonic: "INC", args: "R", desc: "Increment register" },
  { id: "dec", mnemonic: "DEC", args: "R", desc: "Decrement register" },
  { id: "cmp", mnemonic: "CMP", args: "R, Imm", desc: "Compare register with value" },
  { id: "cmp_r_r", mnemonic: "CMP", args: "R, R", desc: "Compare register with register" },
  { id: "jmp", mnemonic: "JMP", args: "Label", desc: "Jump to label" },
  { id: "jz", mnemonic: "JZ", args: "Label", desc: "Jump if Zero flag set" },
  { id: "jnz", mnemonic: "JNZ", args: "Label", desc: "Jump if Zero flag not set" },
  { id: "jc", mnemonic: "JC", args: "Label", desc: "Jump if Carry flag set" },
  { id: "jnc", mnemonic: "JNC", args: "Label", desc: "Jump if Carry flag not set" },
  { id: "call", mnemonic: "CALL", args: "Label", desc: "Call subroutine" },
  { id: "ret", mnemonic: "RET", args: "-", desc: "Return from subroutine" },
  { id: "push", mnemonic: "PUSH", args: "R", desc: "Push register to stack" },
  { id: "pop", mnemonic: "POP", args: "R", desc: "Pop stack to register" },
  { id: "hlt", mnemonic: "HLT", args: "-", desc: "Halt execution" },
  { id: "db", mnemonic: "DB", args: "Val/Str", desc: "Define Byte(s)" },
];
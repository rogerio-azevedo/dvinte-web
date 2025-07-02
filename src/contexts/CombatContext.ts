/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext } from "react";

// Interfaces para Combat
export interface CombatCharacter {
  id: number;
  name: string;
  level: number;
  health: number;
  healthNow: number;
  race: string;
  portrait: string;
  baseAttack: number;
  fortitude: number;
  reflex: number;
  will: number;
  classes: any[];
  armor: any[];
  weapons: any[];
  equipment: any[];
}

export interface CombatStats {
  charInit: number | null;
  fortitude: number | null;
  reflex: number | null;
  will: number | null;
  strength: number | null;
  maxDex: number | null;
  totalCa: number | null;
}

export interface CombatUI {
  menu: string;
  allowDrag: boolean;
  showMenu: boolean;
}

export interface CombatState {
  character: CombatCharacter | null;
  tokens: any[];
  stats: CombatStats;
  ui: CombatUI;
  weapons: any[];
}

export interface CombatContextType {
  state: CombatState;
  setCharacter: (character: CombatCharacter | null) => void;
  setTokens: (tokens: any[]) => void;
  setStats: (stats: Partial<CombatStats>) => void;
  setWeapons: (weapons: any[]) => void;
  setMenu: (menu: string) => void;
  setAllowDrag: (allowDrag: boolean) => void;
  updateUI: (uiData: Partial<CombatUI>) => void;
  resetCombat: () => void;
}

// Estado inicial
export const initialCombatState: CombatState = {
  character: null,
  tokens: [],
  stats: {
    charInit: null,
    fortitude: null,
    reflex: null,
    will: null,
    strength: null,
    maxDex: null,
    totalCa: null,
  },
  ui: {
    menu: "attack",
    allowDrag: false,
    showMenu: true,
  },
  weapons: [],
};

// Criar contexto
export const CombatContext = createContext<CombatContextType | null>(null);

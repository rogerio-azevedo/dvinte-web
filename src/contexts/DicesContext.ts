import { createContext } from "react";

// Tipos
export interface DicesState {
  diceType: string | null;
  diceSides: number | null;
  diceMult: number | null;
  diceResult: number[] | null;
  diceShow: boolean;
  diceRoll: boolean;
}

export interface DicesContextType {
  state: DicesState;
  setDiceData: (data: Partial<DicesState>) => void;
}

// Estado inicial
export const initialState: DicesState = {
  diceType: null,
  diceSides: null,
  diceMult: null,
  diceResult: null,
  diceShow: false,
  diceRoll: false,
};

// Criar contexto
export const DicesContext = createContext<DicesContextType | null>(null);

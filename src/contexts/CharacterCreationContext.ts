/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext } from "react";

// Interfaces
export interface Base {
  name: string;
  age: string;
  height: string;
  weight: string;
  hair: string;
  eye: string;
  skin: string;
  level: string;
  size: string;
  gender: string;
  divinity: string;
  alignment: string;
  race: string;
  user_id: number;
  is_ativo: boolean;
}

export interface Attributes {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface CharacterCreationState {
  portrait: string | null;
  base: Base;
  classe: any[];
  attributes: Attributes;
}

export interface CharacterCreationActions {
  initState: () => void;
  setPortrait: (portraitId: string) => void;
  setBaseData: (baseData: Partial<Base>) => void;
  updateBaseField: (field: keyof Base, value: string) => void;
  setClasses: (classes: any[]) => void;
  setAttributes: (attributes: Partial<Attributes>) => void;
  resetAttributes: () => void;
  resetCharacter: () => void;
  getCharacterData: () => CharacterCreationState & {
    base: Base & { portrait_id: string | null };
  };
}

export interface CharacterCreationContextType {
  state: CharacterCreationState;
  actions: CharacterCreationActions;
}

// Estado inicial
export const initialCharacterCreationState: CharacterCreationState = {
  portrait: null,
  base: {
    name: "",
    age: "",
    height: "",
    weight: "",
    hair: "",
    eye: "",
    skin: "",
    level: "",
    size: "",
    gender: "",
    divinity: "",
    alignment: "",
    race: "",
    user_id: 1,
    is_ativo: true,
  },
  classe: [],
  attributes: {
    str: 8,
    dex: 8,
    con: 8,
    int: 8,
    wis: 8,
    cha: 8,
  },
};

// Criar contexto
export const CharacterCreationContext =
  createContext<CharacterCreationContextType | null>(null);

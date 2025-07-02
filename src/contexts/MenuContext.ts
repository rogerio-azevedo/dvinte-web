/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext } from "react";

// Interfaces
export interface MenuState {
  chatMenu: boolean | null;
  fogLevel: number;
  eraserSize: number;
  fogPersist: any[];
}

export interface MenuActions {
  showMenu: (show: boolean) => void;
  setFogLevel: (level: number) => void;
  setEraserSize: (size: number) => void;
  setFogPersist: (fogData: any[]) => void;
  resetFog: () => void;
}

export interface MenuContextType {
  state: MenuState;
  actions: MenuActions;
}

// Estado inicial
export const initialMenuState: MenuState = {
  chatMenu: null,
  fogLevel: 60,
  eraserSize: 60,
  fogPersist: [],
};

// Chave para localStorage
export const STORAGE_KEY = "dvinte:menu";

// Criar contexto
export const MenuContext = createContext<MenuContextType | null>(null);

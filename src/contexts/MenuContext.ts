/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext } from "react";

// Tipos de ferramentas de desenho
export type DrawTool = 'none' | 'pen' | 'eraser';

// Interfaces
export interface MenuState {
  chatMenu: boolean | null;
  fogLevel: number;
  eraserSize: number;
  fogPersist: any[];
  // Novos estados para desenho livre
  drawTool: DrawTool;
  brushSize: number;
  brushColor: string;
  drawings: any[];
}

export interface MenuActions {
  showMenu: (show: boolean) => void;
  setFogLevel: (level: number) => void;
  setEraserSize: (size: number) => void;
  setFogPersist: (fogData: any[]) => void;
  resetFog: () => void;
  // Novas actions para desenho livre
  setDrawTool: (tool: DrawTool) => void;
  setBrushSize: (size: number) => void;
  setBrushColor: (color: string) => void;
  setDrawings: (drawings: any[]) => void;
  resetDrawings: () => void;
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
  // Valores iniciais para desenho livre
  drawTool: 'none',
  brushSize: 5,
  brushColor: '#FF0000',
  drawings: [],
};

// Chave para localStorage
export const STORAGE_KEY = "dvinte:menu";

// Criar contexto
export const MenuContext = createContext<MenuContextType | null>(null);

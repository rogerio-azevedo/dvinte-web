/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, type ReactNode, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import {
  MenuContext,
  initialMenuState,
  type MenuState,
  type MenuActions,
  STORAGE_KEY,
} from "./MenuContext";

interface MenuProviderProps {
  children: ReactNode;
}

// Funções de persistência
const saveToStorage = (state: MenuState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Erro ao salvar estado do menu no localStorage:", error);
    toast.error("Erro ao salvar estado do menu");
  }
};

const loadFromStorage = (): Partial<MenuState> | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Erro ao carregar estado do menu do localStorage:", error);
    toast.error("Erro ao carregar estado do menu");
    return null;
  }
};

export function MenuProvider({ children }: MenuProviderProps) {
  const [state, setState] = useState<MenuState>(() => {
    const storedState = loadFromStorage();
    return storedState
      ? { ...initialMenuState, ...storedState }
      : initialMenuState;
  });

  // Salvar no localStorage sempre que o estado mudar
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const actions: MenuActions = useMemo(
    () => ({
      // Controlar menu de chat
      showMenu: (show: boolean) => {
        try {
          setState((prev) => ({ ...prev, chatMenu: show }));
        } catch (error) {
          console.error(error);
          toast.error("Erro ao alterar visibilidade do menu");
        }
      },

      // Controlar nível da névoa
      setFogLevel: (level: number) => {
        try {
          setState((prev) => ({ ...prev, fogLevel: level }));
        } catch (error) {
          console.error(error);
          toast.error("Erro ao alterar nível da névoa");
        }
      },

      // Controlar tamanho da borracha
      setEraserSize: (size: number) => {
        try {
          setState((prev) => ({ ...prev, eraserSize: size }));
        } catch (error) {
          console.error(error);
          toast.error("Erro ao alterar tamanho da borracha");
        }
      },

      // Persistir dados da névoa
      setFogPersist: (fogData: any[]) => {
        try {
          setState((prev) => ({ ...prev, fogPersist: fogData }));
        } catch (error) {
          console.error(error);
          toast.error("Erro ao persistir dados da névoa");
        }
      },

      // Resetar névoa
      resetFog: () => {
        try {
          setState((prev) => ({ ...prev, fogPersist: [] }));
        } catch (error) {
          console.error(error);
          toast.error("Erro ao resetar névoa");
        }
      },
    }),
    []
  );

  return (
    <MenuContext.Provider value={{ state, actions }}>
      {children}
    </MenuContext.Provider>
  );
}

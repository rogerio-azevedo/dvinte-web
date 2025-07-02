/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, type ReactNode, useCallback } from "react";
import { toast } from "react-toastify";
import {
  CombatContext,
  initialCombatState,
  type CombatState,
  type CombatCharacter,
  type CombatStats,
  type CombatUI,
} from "./CombatContext";

interface CombatProviderProps {
  children: ReactNode;
}

// Provider moderno e simples
export function CombatProvider({ children }: CombatProviderProps) {
  const [state, setState] = useState<CombatState>(initialCombatState);

  const setCharacter = useCallback((character: CombatCharacter | null) => {
    try {
      setState((prev) => ({ ...prev, character }));
    } catch (err) {
      toast.error("Erro ao definir personagem de combate");
      console.error(err);
    }
  }, []);

  const setTokens = useCallback((tokens: any[]) => {
    try {
      setState((prev) => ({ ...prev, tokens }));
    } catch (err) {
      toast.error("Erro ao definir tokens");
      console.error(err);
    }
  }, []);

  const setStats = useCallback((stats: Partial<CombatStats>) => {
    try {
      setState((prev) => ({
        ...prev,
        stats: { ...prev.stats, ...stats },
      }));
    } catch (err) {
      toast.error("Erro ao atualizar estatísticas");
      console.error(err);
    }
  }, []);

  const setWeapons = useCallback((weapons: any[]) => {
    try {
      setState((prev) => ({ ...prev, weapons }));
    } catch (err) {
      toast.error("Erro ao definir armas");
      console.error(err);
    }
  }, []);

  const setMenu = useCallback((menu: string) => {
    try {
      setState((prev) => ({
        ...prev,
        ui: { ...prev.ui, menu },
      }));
    } catch (err) {
      toast.error("Erro ao alterar menu");
      console.error(err);
    }
  }, []);

  const setAllowDrag = useCallback((allowDrag: boolean) => {
    try {
      setState((prev) => ({
        ...prev,
        ui: { ...prev.ui, allowDrag },
      }));
    } catch (err) {
      toast.error("Erro ao alterar configuração de arrastar");
      console.error(err);
    }
  }, []);

  const updateUI = useCallback((uiData: Partial<CombatUI>) => {
    try {
      setState((prev) => ({
        ...prev,
        ui: { ...prev.ui, ...uiData },
      }));
    } catch (err) {
      toast.error("Erro ao atualizar interface");
      console.error(err);
    }
  }, []);

  const resetCombat = useCallback(() => {
    try {
      setState(initialCombatState);
    } catch (err) {
      toast.error("Erro ao resetar combate");
      console.error(err);
    }
  }, []);

  return (
    <CombatContext.Provider
      value={{
        state,
        setCharacter,
        setTokens,
        setStats,
        setWeapons,
        setMenu,
        setAllowDrag,
        updateUI,
        resetCombat,
      }}
    >
      {children}
    </CombatContext.Provider>
  );
}

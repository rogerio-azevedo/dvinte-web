/* eslint-disable no-console */

import { useState, type ReactNode, useCallback } from "react";
import { toast } from "react-toastify";
import { DicesContext, initialState, type DicesState } from "./DicesContext";

interface DicesProviderProps {
  children: ReactNode;
}

// Provider
export function DicesProvider({ children }: DicesProviderProps) {
  const [state, setState] = useState<DicesState>(initialState);

  const setDiceData = useCallback((data: Partial<DicesState>) => {
    try {
      setState((prev) => ({ ...prev, ...data }));
    } catch (err) {
      toast.error("Houve um erro ao alterar as informações do dado");
      console.error(err);
    }
  }, []);

  return (
    <DicesContext.Provider value={{ state, setDiceData }}>
      {children}
    </DicesContext.Provider>
  );
}

/* eslint-disable no-console */

import { useState, type ReactNode, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { DicesContext, initialState, type DicesState } from "./DicesContext";
import { connect, socket } from "../services/socket";

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

  useEffect(() => {
    connect();

    const handleDiceRoll = (data: any) => {
      // Limpa o estado primeiro (como feito no GenericDices) para garantir que
      // o React perceba a mudança e a animação do dado 3D reinicie.
      setDiceData({
        diceType: null,
        diceSides: null,
        diceMult: null,
        diceResult: null,
        diceShow: false,
        diceRoll: false,
      });

      // Aguarda um curto intervalo para aplicar os novos dados e disparar a rolagem
      setTimeout(() => {
        setDiceData({
          diceType: data.diceType,
          diceSides: data.diceSides,
          diceMult: data.diceMult,
          diceResult: data.diceResult,
          diceRoll: true,
          diceShow: true,
        });
      }, 50);
    };

    socket.on("dice.roll", handleDiceRoll);

    return () => {
      socket.off("dice.roll", handleDiceRoll);
    };
  }, [setDiceData]);

  return (
    <DicesContext.Provider value={{ state, setDiceData }}>
      {children}
    </DicesContext.Provider>
  );
}

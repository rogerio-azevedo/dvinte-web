/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, type ReactNode, useMemo } from "react";
import { toast } from "react-toastify";
import {
  CharacterCreationContext,
  initialCharacterCreationState,
  type CharacterCreationState,
  type Base,
  type Attributes,
  type CharacterCreationActions,
} from "./CharacterCreationContext";

interface CharacterCreationProviderProps {
  children: ReactNode;
}

export function CharacterCreationProvider({
  children,
}: CharacterCreationProviderProps) {
  const [state, setState] = useState<CharacterCreationState>(
    initialCharacterCreationState
  );

  const actions: CharacterCreationActions = useMemo(
    () => ({
      initState: () => {
        try {
          setState(initialCharacterCreationState);
        } catch (err) {
          toast.error("Erro ao inicializar estado da criação de personagem");
          console.error(err);
        }
      },

      setPortrait: (portraitId: string) => {
        try {
          setState((prev) => ({ ...prev, portrait: portraitId }));
        } catch (err) {
          toast.error("Erro ao definir retrato");
          console.error(err);
        }
      },

      setBaseData: (baseData: Partial<Base>) => {
        try {
          setState((prev) => ({
            ...prev,
            base: { ...prev.base, ...baseData },
          }));
        } catch (err) {
          toast.error("Erro ao definir dados básicos");
          console.error(err);
        }
      },

      updateBaseField: (field: keyof Base, value: string) => {
        try {
          setState((prev) => ({
            ...prev,
            base: { ...prev.base, [field]: value },
          }));
        } catch (err) {
          toast.error("Erro ao atualizar campo");
          console.error(err);
        }
      },

      setClasses: (classes: any[]) => {
        try {
          setState((prev) => ({ ...prev, classe: classes }));
        } catch (err) {
          toast.error("Erro ao definir classes");
          console.error(err);
        }
      },

      setAttributes: (attributes: Partial<Attributes>) => {
        try {
          setState((prev) => ({
            ...prev,
            attributes: { ...prev.attributes, ...attributes },
          }));
        } catch (err) {
          toast.error("Erro ao definir atributos");
          console.error(err);
        }
      },

      resetAttributes: () => {
        try {
          setState((prev) => ({
            ...prev,
            attributes: {
              str: 8,
              dex: 8,
              con: 8,
              int: 8,
              wis: 8,
              cha: 8,
            },
          }));
        } catch (err) {
          toast.error("Erro ao resetar atributos");
          console.error(err);
        }
      },

      resetCharacter: () => {
        try {
          setState(initialCharacterCreationState);
        } catch (err) {
          toast.error("Erro ao resetar personagem");
          console.error(err);
        }
      },

      getCharacterData: () => {
        return {
          ...state,
          base: {
            ...state.base,
            portrait_id: state.portrait,
          },
        };
      },
    }),
    [state]
  );

  return (
    <CharacterCreationContext.Provider value={{ state, actions }}>
      {children}
    </CharacterCreationContext.Provider>
  );
}

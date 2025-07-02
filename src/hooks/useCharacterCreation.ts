import { useContext } from "react";
import { CharacterCreationContext } from "../contexts/CharacterCreationContext";

// Hook personalizado para CharacterCreation
export function useCharacterCreation() {
  const context = useContext(CharacterCreationContext);
  if (!context) {
    throw new Error(
      "useCharacterCreation deve ser usado dentro de CharacterCreationProvider"
    );
  }
  return context;
}

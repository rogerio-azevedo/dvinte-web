import { useContext } from "react";
import { CombatContext } from "../contexts/CombatContext";

// Hook personalizado para Combat
export function useCombat() {
  const context = useContext(CombatContext);
  if (!context) {
    throw new Error("useCombat deve ser usado dentro de CombatProvider");
  }
  return context;
}

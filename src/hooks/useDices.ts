import { useContext } from "react";
import { DicesContext } from "../contexts/DicesContext";

// Hook personalizado
export function useDices() {
  const context = useContext(DicesContext);
  if (!context) {
    throw new Error("useDices deve ser usado dentro de DicesProvider");
  }
  return context;
}

// Auth Context
export { AuthContext } from "./AuthContext";
export { AuthProvider } from "./AuthProvider";
export { useAuth } from "../hooks/useAuth";

// Character Creation Context
export { CharacterCreationContext } from "./CharacterCreationContext";
export { CharacterCreationProvider } from "./CharacterCreationProvider";
export { useCharacterCreation } from "../hooks/useCharacterCreation";

// Menu Context (modernizado)
export { MenuContext } from "./MenuContext";
export { MenuProvider } from "./MenuProvider";
export { useMenu } from "../hooks/useMenu";

// Dices Context (modernizado)
export { DicesContext } from "./DicesContext";
export { DicesProvider } from "./DicesProvider";
export { useDices } from "../hooks/useDices";

// Combat Context (modernizado)
export { CombatContext } from "./CombatContext";
export { CombatProvider } from "./CombatProvider";
export { useCombat } from "../hooks/useCombat";

// Types
export type { DicesState, DicesContextType } from "./DicesContext";
export type { CombatState, CombatUI, CombatContextType } from "./CombatContext";

export type {
  Base,
  Attributes,
  CharacterCreationState,
  CharacterCreationContextType,
  CharacterCreationActions,
} from "./CharacterCreationContext";

export type { MenuState, MenuActions, MenuContextType } from "./MenuContext";

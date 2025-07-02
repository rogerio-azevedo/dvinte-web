/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext } from "react";

// Interfaces
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  is_gm?: boolean;
  is_ativo?: boolean;
  avatar?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  state?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  oldPassword?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  city?: string;
  state?: string;
  avatar?: string;
  avatar_id?: number;
}

export interface AuthActions {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

export interface AuthContextType {
  state: AuthState;
  actions: AuthActions;
}

// Chave para localStorage
export const STORAGE_KEY = "dvinte:auth";

// Criar contexto
export const AuthContext = createContext<AuthContextType | null>(null);

/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { toast } from "react-toastify";

import api from "../services/api";
import SpinnerLoad from "../components/SpinnerLoad";
import {
  AuthContext,
  STORAGE_KEY,
  type SignInCredentials,
  type SignUpData,
  type UpdateProfileData,
  type User,
} from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaurar do localStorage ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { user, token } = JSON.parse(stored);
      setUser(user);
      setToken(token);
      if (token) api.defaults.headers.Authorization = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  // Persistir no localStorage sempre que mudar
  useEffect(() => {
    if (user && token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, token]);

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    setLoading(true);
    try {
      const response = await api.post("sessions", credentials);
      const { token, user } = response.data;
      setUser(user);
      setToken(token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      window.location.href = "/dashboard";
    } catch {
      toast.error("Falha na autenticação, verifique seus dados");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (data: SignUpData) => {
    setLoading(true);
    try {
      await api.post("users", { ...data, is_ativo: true });
      toast.success("Cadastro realizado com sucesso!");
      window.location.href = "/";
    } catch {
      toast.error("Falha no cadastro, verifique seus dados!");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    setLoading(true);
    try {
      const response = await api.put<User>("users", data);
      setUser(response.data);
      toast.success("Perfil atualizado com sucesso!");
    } catch {
      toast.error("Houve um erro ao atualizar o Perfil");
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    delete api.defaults.headers.Authorization;
    window.location.href = "/";
  }, []);

  const state = useMemo(
    () => ({
      user,
      token,
      loading,
    }),
    [user, token, loading]
  );

  const actions = useMemo(
    () => ({
      signIn,
      signUp,
      signOut,
      updateProfile,
    }),
    [signIn, signUp, signOut, updateProfile]
  );

  const value = useMemo(
    () => ({
      state,
      actions,
    }),
    [state, actions]
  );

  if (loading) {
    return <SpinnerLoad />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { gql } from "graphql-request";
import graphqlClient from "../graphClient"; // Importamos nuestro cliente

// --- Tipos ---
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

interface AuthResponse {
  tokenAuth: {
    token: string;
  };
}

interface AuthError {
  response: {
    errors: {
      message: string;
    }[];
  };
}

// --- Mutación de GraphQL ---
const TOKEN_AUTH_MUTATION = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

// --- Contexto ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Provider ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Hook de Mutación de TanStack Query
  const mutation = useMutation<AuthResponse, AuthError, { user: string; pass: string }>({
    mutationFn: ({ user, pass }) =>
      graphqlClient.request(TOKEN_AUTH_MUTATION, {
        username: user,
        password: pass,
      }),
    onSuccess: (data) => {
      // 2. Éxito: Guardar token y actualizar estado
      const token = data.tokenAuth.token;
      localStorage.setItem("authToken", token);
      setIsAuthenticated(true);
      setError(null);
    },
    onError: (err) => {
      // 3. Error: Limpiar estado y mostrar error
      console.log(err);
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
      // Extraemos el mensaje de error de GraphQL
      const gqlError = err.response?.errors?.[0]?.message || "Credenciales invalidas.";
      setError(gqlError.includes("credentials") ? "Credenciales inválidas." : gqlError);
    },
  });

  // 4. Función de Login que el componente llamará
  const login = (username: string, password: string) => {
    mutation.mutate({ user: username, pass: password });
  };

  // 5. Función de Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setError(null);
  };

  // 6. Comprobar si ya existe un token al cargar la app
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      // Opcional: podrías añadir una mutación 'verifyToken' aquí
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading: mutation.isPending, // Exponemos el estado 'loading'
        error, // Exponemos el error
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --- Hook personalizado ---
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

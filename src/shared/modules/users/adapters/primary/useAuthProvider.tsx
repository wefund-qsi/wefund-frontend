import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { User } from "../../entities/User";
import type { ApiErrorResult, LoginRequest } from "../../ports/AuthPort";
import type { Result } from "../../../../../types/utils";
import { createLoginUseCase } from "../../use-cases/LoginUseCase";
import { createRegisterUseCase } from "../../use-cases/RegisterUseCase";
import { createMockAuthAdapter } from "../secondary/MockAuthAdapter";
import { createUser } from "../../entities/User";

const SESSION_TOKEN_KEY = "wefund_access_token";
const SESSION_USER_KEY = "wefund_user";

export interface RegisterInput {
  prenom: string;
  nom: string;
  username: string;
  password: string;
}

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login(request: LoginRequest): Promise<Result<{ access_token: string }, ApiErrorResult>>;
  register(input: RegisterInput): Promise<Result<void, ApiErrorResult>>;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const authPort = createMockAuthAdapter();
const loginUseCase = createLoginUseCase(authPort);
const registerUseCase = createRegisterUseCase(authPort);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => sessionStorage.getItem(SESSION_TOKEN_KEY)
  );

  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem(SESSION_USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  });

  const login = useCallback(
    async (request: LoginRequest): Promise<Result<{ access_token: string }, ApiErrorResult>> => {
      const result = await loginUseCase.execute(request);

      if (result.ok) {
        const { access_token } = result.value.data;
        sessionStorage.setItem(SESSION_TOKEN_KEY, access_token);
        setToken(access_token);

        const partialUser = createUser({
          id: "unknown",
          prenom: "",
          nom: "",
          username: request.username,
          role: "VISITEUR",
        });
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(partialUser));
        setUser(partialUser);

        return { ok: true, value: { access_token } };
      }

      return result;
    },
    []
  );

  const register = useCallback(
    async (input: RegisterInput): Promise<Result<void, ApiErrorResult>> => {
      const result = await registerUseCase.execute(input);

      if (result.ok) {
        return { ok: true, value: undefined };
      }

      return result;
    },
    []
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: token !== null,
      login,
      register,
      logout,
    }),
    [user, token, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}

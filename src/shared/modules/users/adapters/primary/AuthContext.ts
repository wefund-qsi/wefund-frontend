import { createContext } from "react";
import type { User } from "../../entities/User";
import type { ApiErrorResult, LoginRequest } from "../../ports/AuthPort";
import type { Result } from "../../../../../types/utils";

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

export const AuthContext = createContext<AuthContextValue | null>(null);

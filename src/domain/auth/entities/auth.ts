import { z } from "zod";
import type { UserId } from "../../users/entities/user";

// --- Types API ---

export type Role = "ADMINISTRATEUR" | "USER";

export interface SignupBase {
  prenom: string;
  nom: string;
  username: string;
}

export interface SignupRequest extends SignupBase {
  password: string;
}

export interface SignupResultData extends SignupBase {
  id: UserId;
  role: Role;
}

export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
};

export type SignupResult = ApiResponse<SignupResultData>;

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResult = ApiResponse<{ access_token: string }>;

export type JwtPayload = {
    sub: string;
    username: string;
    role: Role;
    iat?: number;
    exp?: number;
};

// --- Schémas Zod ---

export const loginSchema = z.object({
  username: z.string().min(1, "authForm.errors.usernameRequired").min(3, "authForm.errors.usernameMinLength").max(20, "authForm.errors.usernameMaxLength"),
  password: z.string().min(1, "authForm.errors.passwordRequired").min(6, "authForm.errors.passwordMinLength").max(50, "authForm.errors.passwordMaxLength"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  prenom: z.string().min(1, "authForm.errors.prenomRequired"),
  nom: z.string().min(1, "authForm.errors.nomRequired"),
  username: z.string().min(1, "authForm.errors.usernameRequired").min(3, "authForm.errors.usernameMinLength").max(20, "authForm.errors.usernameMaxLength"),
  password: z.string().min(1, "authForm.errors.passwordRequired").min(6, "authForm.errors.passwordMinLength").max(50, "authForm.errors.passwordMaxLength"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

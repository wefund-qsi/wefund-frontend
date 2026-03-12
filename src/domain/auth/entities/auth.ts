import { z } from "zod";
import type { UserId } from "../../users/entities/user";

// --- Types API ---

export type Role = "ADMINISTRATEUR" | "USER";

export type SignupRequest = {
  prenom: string;
  nom: string;
  username: string;
  password: string;
  role: Role;
};

export type SignupResultData = {
  id: UserId;
  nom: string;
  prenom: string;
  username: string;
  role: string;
};

export type SignupResult = {
  statusCode: number;
  message: string;
  data: SignupResultData;
  timestamp: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResult = {
  statusCode: number;
  message: string;
  data: {
    access_token: string;
  };
  timestamp: string;
};

export type AuthError = {
  statusCode: number;
  message: string;
  error: string;
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

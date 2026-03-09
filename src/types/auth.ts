import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "loginForm.errors.usernameRequired"),
  password: z.string().min(1, "loginForm.errors.passwordRequired"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  prenom: z.string().min(1, "registerForm.errors.prenomRequired"),
  nom: z.string().min(1, "registerForm.errors.nomRequired"),
  username: z
    .string()
    .min(3, "registerForm.errors.usernameMinLength")
    .regex(/^[a-zA-Z0-9_]+$/, "registerForm.errors.usernameInvalidChars"),
  password: z
    .string()
    .min(6, "registerForm.errors.passwordMinLength"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
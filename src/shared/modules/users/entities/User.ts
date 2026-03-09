import type { UserId } from "../../../../types/user";

export type UserRole =
  | "PORTEUR DE PROJET"
  | "CONTRIBUTEUR"
  | "ADMINISTRATEUR"
  | "VISITEUR";

export const DEFAULT_ROLE: UserRole = "VISITEUR";

const USER_ROLES: readonly UserRole[] = [
  "PORTEUR DE PROJET",
  "CONTRIBUTEUR",
  "ADMINISTRATEUR",
  "VISITEUR",
];

export const isUserRole = (value: unknown): value is UserRole =>
  typeof value === "string" && (USER_ROLES as string[]).includes(value);

export interface User {
  readonly id: UserId;
  readonly prenom: string;
  readonly nom: string;
  readonly username: string;
  readonly role: UserRole;
}

export const createUser = (params: {
  id: string;
  prenom: string;
  nom: string;
  username: string;
  role: UserRole;
}): User => ({
  id: params.id as UserId,
  prenom: params.prenom,
  nom: params.nom,
  username: params.username,
  role: params.role,
});

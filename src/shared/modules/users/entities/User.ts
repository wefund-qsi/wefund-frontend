import type { UserId } from "../../../../types/user";

export type UserRole =
  | "PORTEUR DE PROJET"
  | "CONTRIBUTEUR"
  | "ADMINISTRATEUR"
  | "VISITEUR";

export const DEFAULT_ROLE: UserRole = "VISITEUR";

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
  role: string;
}): User => ({
  id: params.id as UserId,
  prenom: params.prenom,
  nom: params.nom,
  username: params.username,
  role: params.role as UserRole,
});

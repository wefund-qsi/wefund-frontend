/**
 * Entités et schémas d'authentification
 *
 * Ce module centralise tous les types, interfaces et schémas de validation
 * relatifs à l'authentification et l'autorisation dans l'application WeFund.
 * Il inclut les définitions pour l'inscription (signup) et la connexion (login),
 * ainsi que la gestion des rôles utilisateur et des tokens JWT.
 *
 * @module domain/auth/entities/auth
 */

import { z } from "zod";
import type { UserId } from "../../users/entities/user";

// --- Types API ---

/**
 * Énumération des rôles utilisateur disponibles dans le système
 *
 * @typedef {("ADMINISTRATEUR" | "USER")} Role
 *
 * - ADMINISTRATEUR : Accès complet à la plateforme, gestion des utilisateurs et des campagnes
 * - USER : Accès standard, peuvent créer des campagnes et contribuer à des projets
 */
export type Role = "ADMINISTRATEUR" | "USER";

/**
 * Données de base requises pour l'inscription
 *
 * @interface SignupBase
 * @property {string} prenom - Prénom de l'utilisateur
 * @property {string} nom - Nom de famille de l'utilisateur
 * @property {string} username - Identifiant unique pour la connexion
 */
export interface SignupBase {
  prenom: string;
  nom: string;
  username: string;
}

/**
 * Requête d'inscription envoyée au serveur
 *
 * @interface SignupRequest
 * @extends {SignupBase}
 * @property {string} password - Mot de passe en clair (transmis sécurisé via HTTPS)
 */
export interface SignupRequest extends SignupBase {
  password: string;
}

/**
 * Données d'utilisateur retournées après une inscription réussie
 *
 * @interface SignupResultData
 * @extends {SignupBase}
 * @property {UserId} id - Identifiant unique généré pour le nouvel utilisateur
 * @property {Role} role - Rôle assigné à l'utilisateur (par défaut USER)
 */
export interface SignupResultData extends SignupBase {
  id: UserId;
  role: Role;
}

/**
 * Format générique de réponse API
 *
 * Tous les endpoints de l'API retournent des données dans ce format standardisé
 * pour assurer la cohérence et la prévisibilité.
 *
 * @template T Le type des données retournées
 * @typedef {Object} ApiResponse
 * @property {number} statusCode - Code HTTP de la réponse (200, 401, 404, etc.)
 * @property {string} message - Message informatif ou d'erreur
 * @property {T} data - Données utiles de la réponse
 * @property {string} timestamp - Horodatage ISO 8601 de la réponse
 */
export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
};

/**
 * Réponse API pour une inscription réussie
 *
 * @typedef {ApiResponse<SignupResultData>} SignupResult
 */
export type SignupResult = ApiResponse<SignupResultData>;

/**
 * Requête de connexion
 *
 * @typedef {Object} LoginRequest
 * @property {string} username - Identifiant de l'utilisateur
 * @property {string} password - Mot de passe en clair
 */
export type LoginRequest = {
  username: string;
  password: string;
};

/**
 * Réponse API pour une connexion réussie
 *
 * @typedef {ApiResponse<{access_token: string}>} LoginResult
 *
 * Contient un token JWT à utiliser pour les requêtes authentifiées.
 * Le token doit être envoyé dans l'en-tête Authorization: Bearer <token>
 */
export type LoginResult = ApiResponse<{ access_token: string }>;

/**
 * Contenu du JWT après décodage
 *
 * Ces données sont extraites du token JWT stocké et utilisées pour
 * déterminer l'identité et les permissions de l'utilisateur.
 *
 * @typedef {Object} JwtPayload
 * @property {string} sub - Subject (sujet du token), contient l'ID de l'utilisateur
 * @property {string} username - Identifiant de l'utilisateur
 * @property {Role} role - Rôle de l'utilisateur au moment de la création du token
 * @property {number} [iat] - Issued At : horodatage de création du token (optionnel)
 * @property {number} [exp] - Expiration : horodatage d'expiration du token (optionnel)
 */
export type JwtPayload = {
    sub: string;
    username: string;
    role: Role;
    iat?: number;
    exp?: number;
};

// --- Schémas Zod ---

/**
 * Schéma de validation Zod pour le formulaire de connexion
 *
 * Ce schéma valide les données côté client et serveur :
 * - username : Entre 3 et 20 caractères, obligatoire
 * - password : Entre 6 et 50 caractères, obligatoire
 *
 * Les clés de message d'erreur font référence aux clés i18n pour l'internationalisation.
 *
 * @type {z.ZodSchema}
 */
export const loginSchema = z.object({
  username: z.string().min(1, "authForm.errors.usernameRequired").min(3, "authForm.errors.usernameMinLength").max(20, "authForm.errors.usernameMaxLength"),
  password: z.string().min(1, "authForm.errors.passwordRequired").min(6, "authForm.errors.passwordMinLength").max(50, "authForm.errors.passwordMaxLength"),
});

/**
 * Type des valeurs du formulaire de connexion
 *
 * Généré automatiquement à partir du schéma loginSchema.
 * Assure la cohérence entre la validation et le typage TypeScript.
 *
 * @typedef {z.infer<typeof loginSchema>} LoginFormValues
 */
export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Schéma de validation Zod pour le formulaire d'inscription
 *
 * Ce schéma valide les données côté client et serveur :
 * - prenom : Obligatoire, minimum 1 caractère
 * - nom : Obligatoire, minimum 1 caractère
 * - username : Entre 3 et 20 caractères, obligatoire
 * - password : Entre 6 et 50 caractères, obligatoire
 *
 * Les clés de message d'erreur font référence aux clés i18n pour l'internationalisation.
 *
 * @type {z.ZodSchema}
 */
export const signupSchema = z.object({
  prenom: z.string().min(1, "authForm.errors.prenomRequired"),
  nom: z.string().min(1, "authForm.errors.nomRequired"),
  username: z.string().min(1, "authForm.errors.usernameRequired").min(3, "authForm.errors.usernameMinLength").max(20, "authForm.errors.usernameMaxLength"),
  password: z.string().min(1, "authForm.errors.passwordRequired").min(6, "authForm.errors.passwordMinLength").max(50, "authForm.errors.passwordMaxLength"),
});

/**
 * Type des valeurs du formulaire d'inscription
 *
 * Généré automatiquement à partir du schéma signupSchema.
 * Assure la cohérence entre la validation et le typage TypeScript.
 *
 * @typedef {z.infer<typeof signupSchema>} SignupFormValues
 */
export type SignupFormValues = z.infer<typeof signupSchema>;

/**
 * Interface du port pour le dépôt d'authentification
 */
import type { LoginRequest, LoginResult, SignupRequest, SignupResult } from "../entities/auth";

/**
 * Port pour les opérations d'authentification
 */
export interface IAuthRepository {
    /**
     * Enregistre un nouvel utilisateur
     * @param request Données d'inscription
     */
    signup(request: SignupRequest): Promise<SignupResult>;

    /**
     * Authentifie un utilisateur et retourne un token JWT
     * @param request Données de connexion
     */
    login(request: LoginRequest): Promise<LoginResult>;
}

/**
 * Adaptateur HTTP pour le dépôt d'authentification
 *
 * Ce module fournit une implémentation concrète du dépôt d'authentification
 * qui communique avec un serveur distant via des requêtes HTTP REST.
 * Il gère l'inscription (signup) et la connexion (login) des utilisateurs.
 *
 * Cette classe fait partie du pattern Adapter de l'architecture hexagonale,
 * permettant de découpler la logique métier de l'implémentation HTTP spécifique.
 *
 * @module domain/auth/adapters/auth-repository.http
 */

import type { LoginRequest, LoginResult, SignupRequest, SignupResult } from "../entities/auth";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials";
import { UsernameAlreadyExistsException } from "../exceptions/username-already-exists";
import type { IAuthRepository } from "../ports/auth-repository.interface";

/**
 * Adaptateur HTTP pour les opérations d'authentification
 *
 * Cette classe implémente l'interface IAuthRepository en utilisant l'API Fetch
 * pour communiquer avec un serveur backend. Elle gère :
 * - L'inscription (signup) d'nouveaux utilisateurs
 * - La connexion (login) des utilisateurs existants
 * - La gestion des erreurs spécifiques (credentials invalides, username en doublons)
 *
 * Les erreurs HTTP sont mappées à des exceptions métier appropriées
 * pour une meilleure gestion dans la couche application.
 *
 * @implements {IAuthRepository}
 *
 * @example
 * ```typescript
 * const authRepo = new HttpAuthRepository('http://localhost:3000');
 *
 * // Inscription
 * const signupResult = await authRepo.signup({
 *     prenom: 'Jean',
 *     nom: 'Dupont',
 *     username: 'jeandupont',
 *     password: 'SecurePassword123'
 * });
 *
 * // Connexion
 * const loginResult = await authRepo.login({
 *     username: 'jeandupont',
 *     password: 'SecurePassword123'
 * });
 * ```
 */
export class HttpAuthRepository implements IAuthRepository {
    /**
     * URL de base du serveur d'authentification
     *
     * @private
     * @type {string}
     * @example "http://localhost:3000" ou "https://api.wefund.com"
     */
    private readonly baseUrl: string;

    /**
     * Constructeur de l'adaptateur HTTP
     *
     * @param {string} baseUrl - URL de base du serveur backend
     *                          (ex: "http://localhost:3000")
     */
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * Enregistre un nouvel utilisateur via une requête POST
     *
     * Envoie les données d'inscription au serveur backend et traite la réponse.
     * Le rôle est toujours défini à "USER" pour les nouvelles inscriptions.
     *
     * Codes de statut gérés :
     * - 201/200 : Inscription réussie, retourne les données de l'utilisateur créé
     * - 409 : Username déjà existant, lève une UsernameAlreadyExistsException
     * - Autres codes d'erreur : Lève une erreur générique
     *
     * @param {SignupRequest} request - Données d'inscription de l'utilisateur
     * @param {string} request.prenom - Prénom de l'utilisateur
     * @param {string} request.nom - Nom de l'utilisateur
     * @param {string} request.username - Identifiant unique de connexion
     * @param {string} request.password - Mot de passe en clair
     *
     * @returns {Promise<SignupResult>} Résultat de l'inscription incluant les données du nouvel utilisateur
     *
     * @throws {UsernameAlreadyExistsException} Si le username existe déjà (HTTP 409)
     * @throws {Error} Si la requête échoue pour d'autres raisons
     *
     * @example
     * ```typescript
     * try {
     *     const result = await authRepo.signup({
     *         prenom: 'Marie',
     *         nom: 'Martin',
     *         username: 'mariemartin',
     *         password: 'SecurePass123'
     *     });
     *     console.log(result.data.id); // ID du nouvel utilisateur
     * } catch (error) {
     *     if (error instanceof UsernameAlreadyExistsException) {
     *         console.log('Ce username est déjà utilisé');
     *     }
     * }
     * ```
     */
    async signup(request: SignupRequest): Promise<SignupResult> {
        const response = await fetch(`${this.baseUrl}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...request, role: "USER" }),
        });

        if (response.status === 409) {
            throw new UsernameAlreadyExistsException(request.username);
        }

        if (!response.ok) {
            throw new Error("Signup failed");
        }

        return response.json() as Promise<SignupResult>;
    }

    /**
     * Authentifie un utilisateur et retourne un token JWT
     *
     * Envoie les identifiants de connexion au serveur backend et reçoit un token JWT
     * à utiliser pour les requêtes authentifiées ultérieures.
     *
     * Codes de statut gérés :
     * - 200 : Connexion réussie, retourne le token JWT
     * - 401/404 : Credentials invalides (username inexistant ou password incorrect),
     *             lève une InvalidCredentialsException
     * - Autres codes d'erreur : Lève une erreur générique
     *
     * @param {LoginRequest} request - Données de connexion
     * @param {string} request.username - Identifiant de l'utilisateur
     * @param {string} request.password - Mot de passe en clair
     *
     * @returns {Promise<LoginResult>} Résultat de la connexion contenant le token JWT d'accès
     *
     * @throws {InvalidCredentialsException} Si les identifiants sont invalides (HTTP 401/404)
     * @throws {Error} Si la requête échoue pour d'autres raisons
     *
     * @example
     * ```typescript
     * try {
     *     const result = await authRepo.login({
     *         username: 'jeandupont',
     *         password: 'SecurePassword123'
     *     });
     *
     *     const token = result.data.access_token;
     *     // Stocker le token et l'utiliser pour les requêtes authentifiées
     *     localStorage.setItem('authToken', token);
     * } catch (error) {
     *     if (error instanceof InvalidCredentialsException) {
     *         console.log('Identifiants incorrects');
     *     }
     * }
     * ```
     */
    async login(request: LoginRequest): Promise<LoginResult> {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });

        if (response.status === 401 || response.status === 404) {
            throw new InvalidCredentialsException();
        }

        if (!response.ok) {
            throw new Error("Login failed");
        }

        return response.json() as Promise<LoginResult>;
    }
}

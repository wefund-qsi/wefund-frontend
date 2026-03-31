/**
 * Adaptateur en mémoire pour le dépôt d'authentification
 *
 * Ce module fournit une implémentation du dépôt d'authentification qui stocke
 * les utilisateurs en mémoire (RAM). Cette implémentation est principalement utilisée
 * pour les tests et le développement, car les données sont perdues au redémarrage.
 *
 * Cette classe fait partie du pattern Adapter de l'architecture hexagonale,
 * permettant de découpler la logique métier de l'implémentation en mémoire.
 *
 * @module domain/auth/adapters/auth-repository.in-memory
 */

import type { LoginRequest, LoginResult, SignupRequest, SignupResult, SignupResultData } from "../entities/auth";
import { UserId } from "../../users/entities/user";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials";
import { UsernameAlreadyExistsException } from "../exceptions/username-already-exists";
import type { IAuthRepository } from "../ports/auth-repository.interface";
import type { IIdGenerator } from "../../../core/ports/id-generator.interface";
import type { IDateGenerator } from "../../../core/ports/date-generator.interface";

/**
 * Adaptateur en mémoire pour les opérations d'authentification
 *
 * Cette classe implémente l'interface IAuthRepository en stockant les utilisateurs
 * dans une liste en mémoire. Elle gère :
 * - L'inscription (signup) de nouveaux utilisateurs
 * - La connexion (login) des utilisateurs existants
 * - La validation des identifiants uniques (username)
 * - La génération de tokens JWT mockés pour les tests
 *
 * Avantages :
 * - Aucune dépendance externe (pas de serveur HTTP requis)
 * - Idéale pour les tests unitaires et le développement local
 * - Déterministe et contrôlable
 *
 * Limitations :
 * - Les données sont perdues à chaque redémarrage de l'application
 * - Ne reflète pas le comportement exact d'une API distante
 *
 * @implements {IAuthRepository}
 *
 * @example
 * ```typescript
 * const idGen = new RealIdGenerator();
 * const dateGen = new RealDateGenerator();
 * const authRepo = new InMemoryAuthRepository(idGen, dateGen);
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
export class InMemoryAuthRepository implements IAuthRepository {
    /**
     * Stockage en mémoire de tous les utilisateurs enregistrés
     *
     * Chaque utilisateur contient ses données personnelles et son mot de passe en clair
     * (acceptable uniquement en environnement de test/développement).
     *
     * @private
     * @type {(SignupResultData & { password: string })[]}
     */
    private users: (SignupResultData & { password: string })[] = [];

    /**
     * Générateur d'identifiants uniques (UUID)
     *
     * Injecté via le constructeur pour permettre le mockage en tests.
     *
     * @private
     * @type {IIdGenerator}
     */
    private readonly idGenerator: IIdGenerator;

    /**
     * Générateur de dates pour les horodatages
     *
     * Injecté via le constructeur pour permettre le mockage en tests.
     *
     * @private
     * @type {IDateGenerator}
     */
    private readonly dateGenerator: IDateGenerator;

    /**
     * Constructeur du dépôt en mémoire
     *
     * Accepte les générateurs d'identifiants et de dates en injection de dépendances
     * pour faciliter les tests avec des implémentations mockées.
     *
     * @param {IIdGenerator} idGenerator - Générateur d'identifiants uniques
     * @param {IDateGenerator} dateGenerator - Générateur de dates et horodatages
     *
     * @example
     * ```typescript
     * const authRepo = new InMemoryAuthRepository(
     *     new RealIdGenerator(),
     *     new RealDateGenerator()
     * );
     * ```
     */
    constructor(
        idGenerator: IIdGenerator,
        dateGenerator: IDateGenerator,
    ) {
        this.idGenerator = idGenerator;
        this.dateGenerator = dateGenerator;
    }

    /**
     * Enregistre un nouvel utilisateur en mémoire
     *
     * Valide que le username est unique, génère un ID, et stocke l'utilisateur
     * dans la liste en mémoire. Le rôle est toujours défini à "USER" pour
     * les nouvelles inscriptions.
     *
     * Processus :
     * 1. Vérifie que le username n'existe pas déjà
     * 2. Génère un ID unique via le générateur d'ID
     * 3. Crée l'objet utilisateur avec le mot de passe
     * 4. Stocke l'utilisateur en mémoire
     * 5. Retourne les données de l'utilisateur (sans le mot de passe)
     *
     * @param {SignupRequest} request - Données d'inscription de l'utilisateur
     * @param {string} request.prenom - Prénom de l'utilisateur
     * @param {string} request.nom - Nom de l'utilisateur
     * @param {string} request.username - Identifiant unique de connexion
     * @param {string} request.password - Mot de passe en clair
     *
     * @returns {Promise<SignupResult>} Promesse résolue avec les données du nouvel utilisateur
     *
     * @throws {UsernameAlreadyExistsException} Si le username existe déjà
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
     *
     *     console.log(result.data.id); // ID unique généré
     *     console.log(result.statusCode); // 201
     * } catch (error) {
     *     if (error instanceof UsernameAlreadyExistsException) {
     *         console.log('Ce username est déjà utilisé');
     *     }
     * }
     * ```
     */
    signup(request: SignupRequest): Promise<SignupResult> {
        const existingUser = this.users.find(u => u.username === request.username);
        if (existingUser) {
            return Promise.reject(new UsernameAlreadyExistsException(request.username));
        }

        const id = UserId(this.idGenerator.generate());

        const userData: SignupResultData & { password: string } = {
            id,
            nom: request.nom,
            prenom: request.prenom,
            username: request.username,
            role: "USER",
            password: request.password,
        };

        this.users.push(userData);

        return Promise.resolve({
            statusCode: 201,
            message: "User, auth and role created successfully",
            data: {
                id: userData.id,
                nom: userData.nom,
                prenom: userData.prenom,
                username: userData.username,
                role: userData.role,
            },
            timestamp: this.dateGenerator.now().toISOString(),
        });
    }

    /**
     * Authentifie un utilisateur et retourne un token JWT mockée
     *
     * Recherche l'utilisateur par username et vérifie le mot de passe.
     * En cas de succès, génère un token JWT mockée au format standard.
     *
     * Format du token :
     * - Header : "fake-header"
     * - Payload : Objet JSON encodé en base64 contenant l'ID, username et rôle
     * - Signature : "fake-signature"
     *
     * Le payload mockée est sufisant pour les tests mais ne serait pas accepté
     * par une vraie vérification JWT en production.
     *
     * Processus :
     * 1. Recherche un utilisateur avec le username et password correspondants
     * 2. Si l'utilisateur n'existe pas, lève InvalidCredentialsException
     * 3. Génère un token JWT mockée
     * 4. Retourne le token dans la réponse API
     *
     * @param {LoginRequest} request - Données de connexion
     * @param {string} request.username - Identifiant de l'utilisateur
     * @param {string} request.password - Mot de passe en clair
     *
     * @returns {Promise<LoginResult>} Promesse résolue avec le token JWT d'accès
     *
     * @throws {InvalidCredentialsException} Si le username n'existe pas ou le password est incorrect
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
     *     console.log(token);
     *     // "fake-header.eyJzdWIiOiIxMjM0IiwidXNlcm5hbWUiOiJqZWFuZHVwb250Iiwicm9sZSI6IlVTRVIifQ==.fake-signature"
     * } catch (error) {
     *     if (error instanceof InvalidCredentialsException) {
     *         console.log('Identifiants incorrects');
     *     }
     * }
     * ```
     */
    login(request: LoginRequest): Promise<LoginResult> {
        const user = this.users.find(
            u => u.username === request.username && u.password === request.password
        );

        if (!user) {
            return Promise.reject(new InvalidCredentialsException());
        }

        const payload = btoa(JSON.stringify({ sub: user.id, username: user.username, role: user.role }));

        return Promise.resolve({
            statusCode: 200,
            message: "Login successful",
            data: {
                access_token: `fake-header.${payload}.fake-signature`,
            },
            timestamp: this.dateGenerator.now().toISOString(),
        });
    }
}

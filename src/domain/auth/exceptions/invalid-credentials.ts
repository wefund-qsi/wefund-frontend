/**
 * Exception levée lors d'une tentative de connexion avec des identifiants invalides
 *
 * Ce module définit l'exception utilisée quand un utilisateur tente de se connecter
 * avec un username qui n'existe pas ou un mot de passe incorrect.
 *
 * Cette exception fait partie de la couche métier (domain) et est levée par les
 * adaptateurs du dépôt d'authentification pour signaler une authentification échouée.
 *
 * @module domain/auth/exceptions/invalid-credentials
 */

/**
 * Exception levée lors d'identifiants de connexion invalides
 *
 * Cette exception est levée par les implémentations du dépôt d'authentification
 * ({@link HttpAuthRepository}, {@link InMemoryAuthRepository}) lorsque :
 * - Le username n'existe pas dans le système
 * - Le mot de passe fourni est incorrect pour le username donné
 *
 * Usage dans les use-cases :
 * Cette exception est capturée dans les use-cases (like {@link login})
 * pour être transformée en une réponse d'erreur appropriée à afficher
 * à l'utilisateur (message d'erreur internationalisé).
 *
 * @extends {Error}
 *
 * @example
 * ```typescript
 * // Exemple d'utilisation dans un use-case
 * try {
 *     const result = await authRepository.login({
 *         username: 'jeandupont',
 *         password: 'wrongPassword'
 *     });
 * } catch (error) {
 *     if (error instanceof InvalidCredentialsException) {
 *         // Afficher un message d'erreur à l'utilisateur
 *         showError('Identifiants invalides. Vérifiez votre username et mot de passe.');
 *     }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Exemple d'utilisation dans un composant React
 * const handleLogin = async (credentials: LoginRequest) => {
 *     try {
 *         const result = await authRepository.login(credentials);
 *         // Succès : stocker le token
 *         localStorage.setItem('authToken', result.data.access_token);
 *     } catch (error) {
 *         if (error instanceof InvalidCredentialsException) {
 *             setErrorMessage(t('login.errors.invalidCredentials'));
 *         }
 *     }
 * };
 * ```
 */
export class InvalidCredentialsException extends Error {
    /**
     * Constructeur de l'exception
     *
     * Initialise une exception avec un message d'erreur générique.
     * Le message ne révèle pas si c'est le username ou le password qui est incorrect
     * pour des raisons de sécurité (prévention de l'énumération d'utilisateurs).
     *
     * @constructor
     */
    constructor() {
        super("Invalid credentials.");
        this.name = "InvalidCredentialsException";
    }
}

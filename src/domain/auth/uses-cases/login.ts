import type { Executable } from "../../../shared/executable";
import type { LoginRequest, LoginResult } from "../entities/auth";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials";
import type { IAuthRepository } from "../ports/auth-repository.interface";

/**
 * Use-case pour l'authentification d'un utilisateur
 *
 * Valide les identifiants et retourne un token JWT en cas de succès.
 * Lève une InvalidCredentialsException en cas d'erreur d'authentification.
 */
export class Login implements Executable<LoginRequest, LoginResult> {
    private readonly authRepository: IAuthRepository;

    constructor(authRepository: IAuthRepository) {
        this.authRepository = authRepository;
    }

    async execute(data: LoginRequest): Promise<LoginResult> {
        try {
            return await this.authRepository.login(data);
        } catch {
            throw new InvalidCredentialsException();
        }
    }
}

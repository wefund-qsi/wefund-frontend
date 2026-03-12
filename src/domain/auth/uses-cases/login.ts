import type { Executable } from "../../../shared/executable";
import type { LoginRequest, LoginResult } from "../entities/auth";
import type { IAuthRepository } from "../ports/auth-repository.interface";

export class Login implements Executable<LoginRequest, LoginResult> {
    private readonly authRepository: IAuthRepository;

    constructor(authRepository: IAuthRepository) {
        this.authRepository = authRepository;
    }

    async execute(data: LoginRequest): Promise<LoginResult> {
        return await this.authRepository.login(data);
    }
}

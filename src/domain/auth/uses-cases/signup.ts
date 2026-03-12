import type { Executable } from "../../../shared/executable";
import type { SignupRequest, SignupResult } from "../entities/auth";
import type { IAuthRepository } from "../ports/auth-repository.interface";

export class Signup implements Executable<Omit<SignupRequest, "role">, SignupResult> {
    private readonly authRepository: IAuthRepository;

    constructor(authRepository: IAuthRepository) {
        this.authRepository = authRepository;
    }

    async execute(data: Omit<SignupRequest, "role">): Promise<SignupResult> {
        const request: SignupRequest = {
            ...data,
            role: "USER",
        };

        return await this.authRepository.signup(request);
    }
}

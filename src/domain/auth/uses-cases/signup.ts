import type { Executable } from "../../../shared/executable";
import type { SignupRequest, SignupResult } from "../entities/auth";
import { UsernameAlreadyExistsException } from "../exceptions/username-already-exists";
import type { IAuthRepository } from "../ports/auth-repository.interface";

export class Signup implements Executable<SignupRequest, SignupResult> {
    private readonly authRepository: IAuthRepository;

    constructor(authRepository: IAuthRepository) {
        this.authRepository = authRepository;
    }

    async execute(data: SignupRequest): Promise<SignupResult> {
        try {
            return await this.authRepository.signup(data);
        } catch (error) {
            if (error instanceof UsernameAlreadyExistsException) {
                throw error;
            }
            throw new Error("Signup failed");
        }
    }
}

import type { LoginRequest, LoginResult, SignupRequest, SignupResult } from "../entities/auth";

export interface IAuthRepository {
    signup(request: SignupRequest): Promise<SignupResult>;
    login(request: LoginRequest): Promise<LoginResult>;
}

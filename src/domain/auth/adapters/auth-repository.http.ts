import type { LoginRequest, LoginResult, SignupRequest, SignupResult } from "../entities/auth";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials";
import { UsernameAlreadyExistsException } from "../exceptions/username-already-exists";
import type { IAuthRepository } from "../ports/auth-repository.interface";

export class HttpAuthRepository implements IAuthRepository {
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

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

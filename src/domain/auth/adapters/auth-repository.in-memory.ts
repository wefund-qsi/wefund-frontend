import type { LoginRequest, LoginResult, SignupRequest, SignupResult, SignupResultData } from "../entities/auth";
import { UserId } from "../../users/entities/user";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials";
import { UsernameAlreadyExistsException } from "../exceptions/username-already-exists";
import type { IAuthRepository } from "../ports/auth-repository.interface";

export class InMemoryAuthRepository implements IAuthRepository {
    private users: (SignupResultData & { password: string })[] = [];
    private idCounter = 0;

    signup(request: SignupRequest): Promise<SignupResult> {
        const existingUser = this.users.find(u => u.username === request.username);
        if (existingUser) {
            return Promise.reject(new UsernameAlreadyExistsException(request.username));
        }

        this.idCounter++;
        const id = UserId(`user-${this.idCounter}`);

        const userData: SignupResultData & { password: string } = {
            id,
            nom: request.nom,
            prenom: request.prenom,
            username: request.username,
            role: request.role,
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
            timestamp: new Date().toISOString(),
        });
    }

    login(request: LoginRequest): Promise<LoginResult> {
        const user = this.users.find(
            u => u.username === request.username && u.password === request.password
        );

        if (!user) {
            return Promise.reject(new InvalidCredentialsException());
        }

        return Promise.resolve({
            statusCode: 200,
            message: "Login successful",
            data: {
                access_token: `fake-jwt-token-${user.id}`,
            },
            timestamp: new Date().toISOString(),
        });
    }
}

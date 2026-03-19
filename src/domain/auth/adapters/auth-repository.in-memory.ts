import type { LoginRequest, LoginResult, SignupRequest, SignupResult, SignupResultData } from "../entities/auth";
import { UserId } from "../../users/entities/user";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials";
import { UsernameAlreadyExistsException } from "../exceptions/username-already-exists";
import type { IAuthRepository } from "../ports/auth-repository.interface";
import type { IIdGenerator } from "../../../core/ports/id-generator.interface";
import type { IDateGenerator } from "../../../core/ports/date-generator.interface";

export class InMemoryAuthRepository implements IAuthRepository {
    private users: (SignupResultData & { password: string })[] = [];
    private readonly idGenerator: IIdGenerator;
    private readonly dateGenerator: IDateGenerator;

    constructor(
        idGenerator: IIdGenerator,
        dateGenerator: IDateGenerator,
    ) {
        this.idGenerator = idGenerator;
        this.dateGenerator = dateGenerator;
    }

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

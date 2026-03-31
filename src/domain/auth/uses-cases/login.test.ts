import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryAuthRepository } from "../adapters/auth-repository.in-memory";
import { Login } from "./login";
import { Signup } from "./signup";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials";
import type { IIdGenerator } from "../../../core/ports/id-generator.interface";
import type { IDateGenerator } from "../../../core/ports/date-generator.interface";

/**
 * Tests unitaires pour le use-case Login
 *
 * Vérifie que l'authentification fonctionne correctement avec des identifiants valides
 * et lève les exceptions appropriées en cas d'erreur (password incorrect, utilisateur inexistant).
 */
describe("Login", () => {
    let repository: InMemoryAuthRepository;
    let login: Login;
    let signup: Signup;
    let idGenerator: IIdGenerator;
    let dateGenerator: IDateGenerator;

    beforeEach(() => {
        idGenerator = { generate: () => "stub-id" };
        dateGenerator = { now: () => new Date("2026-01-01T00:00:00.000Z") };
        repository = new InMemoryAuthRepository(idGenerator, dateGenerator);
        login = new Login(repository);
        signup = new Signup(repository);
    });

    it("authentifie un utilisateur avec des identifiants valides", async () => {
        await signup.execute({
            prenom: "alice",
            nom: "duval",
            username: "alice",
            password: "secret",
        });

        const result = await login.execute({
            username: "alice",
            password: "secret",
        });

        expect(result.statusCode).toBe(200);
        expect(result.message).toBe("Login successful");
        expect(result.data.access_token).toBeDefined();
        expect(result.data.access_token.length).toBeGreaterThan(0);
    });

    it("retourne un timestamp", async () => {
        await signup.execute({
            prenom: "alice",
            nom: "duval",
            username: "alice",
            password: "secret",
        });

        const result = await login.execute({
            username: "alice",
            password: "secret",
        });

        expect(result.timestamp).toBeDefined();
    });

    it("lève une erreur avec des identifiants invalides", async () => {
        await signup.execute({
            prenom: "alice",
            nom: "duval",
            username: "alice",
            password: "secret",
        });

        await expect(
            login.execute({
                username: "alice",
                password: "wrong-password",
            })
        ).rejects.toThrow(InvalidCredentialsException);
    });

    it("lève une erreur si l'utilisateur n'existe pas", async () => {
        await expect(
            login.execute({
                username: "inexistant",
                password: "secret",
            })
        ).rejects.toThrow(InvalidCredentialsException);
    });
});

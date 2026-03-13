import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryAuthRepository } from "../adapters/auth-repository.in-memory";
import { Signup } from "./signup";
import type { IIdGenerator } from "../../../core/ports/id-generator.interface";
import type { IDateGenerator } from "../../../core/ports/date-generator.interface";

describe("Signup", () => {
    let repository: InMemoryAuthRepository;
    let signup: Signup;
    let idGenerator: IIdGenerator;
    let dateGenerator: IDateGenerator;

    beforeEach(() => {
        idGenerator = { generate: () => "stub-id" };
        dateGenerator = { now: () => new Date("2026-01-01T00:00:00.000Z") };
        repository = new InMemoryAuthRepository(idGenerator, dateGenerator);
        signup = new Signup(repository);
    });

    it("crée un utilisateur avec les données fournies", async () => {
        const data = {
            prenom: "alice",
            nom: "duval",
            username: "alice",
            password: "secret",
        };

        const result = await signup.execute(data);

        expect(result.statusCode).toBe(201);
        expect(result.data.prenom).toBe(data.prenom);
        expect(result.data.nom).toBe(data.nom);
        expect(result.data.username).toBe(data.username);
    });

    it("assigne le rôle USER par défaut", async () => {
        const data = {
            prenom: "alice",
            nom: "duval",
            username: "alice",
            password: "secret",
        };

        const result = await signup.execute(data);

        expect(result.data.role).toBe("USER");
    });

    it("retourne un id pour l'utilisateur créé", async () => {
        const data = {
            prenom: "alice",
            nom: "duval",
            username: "alice",
            password: "secret",
        };

        const result = await signup.execute(data);

        expect(result.data.id).toBeDefined();
        expect(result.data.id.length).toBeGreaterThan(0);
    });

    it("retourne un message de succès", async () => {
        const data = {
            prenom: "alice",
            nom: "duval",
            username: "alice",
            password: "secret",
        };

        const result = await signup.execute(data);

        expect(result.message).toBe("User, auth and role created successfully");
    });

    it("retourne un timestamp", async () => {
        const data = {
            prenom: "alice",
            nom: "duval",
            username: "alice",
            password: "secret",
        };

        const result = await signup.execute(data);

        expect(result.timestamp).toBeDefined();
    });

    it("lève une erreur si le username existe déjà", async () => {
        const data = {
            prenom: "alice",
            nom: "duval",
            username: "alice",
            password: "secret",
        };

        await signup.execute(data);

        await expect(signup.execute(data)).rejects.toThrow(
            'Username "alice" already exists.'
        );
    });
});

import { createRegisterUseCase } from "../../shared/modules/users/use-cases/RegisterUseCase";
import type { IAuthPort } from "../../shared/modules/users/ports/AuthPort";
import { Ok, Err } from "../../types/utils";

const makePort = (overrides?: Partial<IAuthPort>): IAuthPort =>
  ({
    login: vi.fn(),
    signup: vi.fn().mockResolvedValue(
      Ok({
        statusCode: 201,
        message: "User, auth and role created successfully",
        data: {
          id: "uuid-123",
          nom: "Duval",
          prenom: "Alice",
          username: "alice",
          role: "VISITEUR",
        },
        timestamp: "2026-01-01T00:00:00.000Z",
      })
    ),
    ...overrides,
  }) as unknown as IAuthPort;

describe("RegisterUseCase", () => {
  it("retourne un Result ok avec les données utilisateur quand le port réussit", async () => {
    const port = makePort();
    const useCase = createRegisterUseCase(port);

    const result = await useCase.execute({
      prenom: "Alice",
      nom: "Duval",
      username: "alice",
      password: "secret",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.data.username).toBe("alice");
      expect(result.value.data.role).toBe("VISITEUR");
      expect(result.value.statusCode).toBe(201);
    }
  });

  it("injecte automatiquement le rôle VISITEUR sans que l'appelant le fournisse", async () => {
    const port = makePort();
    const useCase = createRegisterUseCase(port);

    await useCase.execute({
      prenom: "Alice",
      nom: "Duval",
      username: "alice",
      password: "secret",
    });

    expect(port.signup).toHaveBeenCalledWith(
      expect.objectContaining({ role: "VISITEUR" })
    );
  });

  it("transmet tous les champs au port", async () => {
    const port = makePort();
    const useCase = createRegisterUseCase(port);

    await useCase.execute({
      prenom: "Alice",
      nom: "Duval",
      username: "alice",
      password: "secret",
    });

    expect(port.signup).toHaveBeenCalledWith({
      prenom: "Alice",
      nom: "Duval",
      username: "alice",
      password: "secret",
      role: "VISITEUR",
    });
  });

  it("retourne un Result error quand le username est déjà pris (409)", async () => {
    const port = makePort({
      signup: vi.fn().mockResolvedValue(
        Err({ statusCode: 409, message: "Ce nom d'utilisateur est déjà pris", error: "Conflict" })
      ),
    });
    const useCase = createRegisterUseCase(port);

    const result = await useCase.execute({
      prenom: "Alice",
      nom: "Duval",
      username: "alice",
      password: "secret",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.statusCode).toBe(409);
      expect(result.error.error).toBe("Conflict");
    }
  });

  it("retourne un Result error quand le port échoue (500)", async () => {
    const port = makePort({
      signup: vi.fn().mockResolvedValue(
        Err({ statusCode: 500, message: "Erreur serveur", error: "Internal Server Error" })
      ),
    });
    const useCase = createRegisterUseCase(port);

    const result = await useCase.execute({
      prenom: "Alice",
      nom: "Duval",
      username: "alice",
      password: "secret",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.statusCode).toBe(500);
    }
  });

  it("ne fait qu'un seul appel au port par exécution", async () => {
    const port = makePort();
    const useCase = createRegisterUseCase(port);

    await useCase.execute({ prenom: "A", nom: "B", username: "ab1", password: "123456" });
    await useCase.execute({ prenom: "C", nom: "D", username: "cd1", password: "123456" });

    expect(port.signup).toHaveBeenCalledTimes(2);
  });
});
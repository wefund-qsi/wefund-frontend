import { createLoginUseCase } from "../../shared/modules/users/use-cases/LoginUseCase";
import type { IAuthPort } from "../../shared/modules/users/ports/AuthPort";
import { Ok, Err } from "../../types/utils";

const makePort = (overrides?: Partial<IAuthPort>): IAuthPort =>
  ({
    login: vi.fn().mockResolvedValue(
      Ok({
        statusCode: 200,
        message: "Login successful",
        data: { access_token: "mock-jwt-token" },
        timestamp: "2026-01-01T00:00:00.000Z",
      })
    ),
    signup: vi.fn(),
    ...overrides,
  }) as unknown as IAuthPort;

describe("LoginUseCase", () => {
  it("retourne un Result ok avec le token quand le port réussit", async () => {
    const port = makePort();
    const useCase = createLoginUseCase(port);

    const result = await useCase.execute({ username: "alice", password: "secret" });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.data.access_token).toBe("mock-jwt-token");
      expect(result.value.statusCode).toBe(200);
    }
  });

  it("transmet les identifiants au port", async () => {
    const loginFn = vi.fn().mockResolvedValue(
      Ok({
        statusCode: 200,
        message: "Login successful",
        data: { access_token: "mock-jwt-token" },
        timestamp: "2026-01-01T00:00:00.000Z",
      })
    );
    const port = makePort({ login: loginFn });
    const useCase = createLoginUseCase(port);

    await useCase.execute({ username: "alice", password: "secret" });

    expect(loginFn).toHaveBeenCalledOnce();
    expect(loginFn).toHaveBeenCalledWith({ username: "alice", password: "secret" });
  });

  it("retourne un Result error quand le port échoue (401)", async () => {
    const port = makePort({
      login: vi.fn().mockResolvedValue(
        Err({ statusCode: 401, message: "Identifiants invalides", error: "Unauthorized" })
      ),
    });
    const useCase = createLoginUseCase(port);

    const result = await useCase.execute({ username: "alice", password: "wrong" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.statusCode).toBe(401);
      expect(result.error.error).toBe("Unauthorized");
    }
  });

  it("retourne un Result error quand le port échoue (500)", async () => {
    const port = makePort({
      login: vi.fn().mockResolvedValue(
        Err({ statusCode: 500, message: "Erreur serveur", error: "Internal Server Error" })
      ),
    });
    const useCase = createLoginUseCase(port);

    const result = await useCase.execute({ username: "alice", password: "secret" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.statusCode).toBe(500);
    }
  });

  it("ne fait qu'un seul appel au port par exécution", async () => {
    const loginFn = vi.fn().mockResolvedValue(
      Ok({
        statusCode: 200,
        message: "Login successful",
        data: { access_token: "mock-jwt-token" },
        timestamp: "2026-01-01T00:00:00.000Z",
      })
    );
    const port = makePort({ login: loginFn });
    const useCase = createLoginUseCase(port);

    await useCase.execute({ username: "alice", password: "secret" });
    await useCase.execute({ username: "bob", password: "pass" });

    expect(loginFn).toHaveBeenCalledTimes(2);
  });
});
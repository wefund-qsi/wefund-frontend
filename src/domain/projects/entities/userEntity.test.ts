import { createUser, DEFAULT_ROLE, isUserRole } from "../../shared/modules/users/entities/User";
import { UserId } from "../../types/user";

describe("User entity", () => {
  it("crée un utilisateur avec tous les champs", () => {
    const user = createUser({
      id: "uuid-123",
      prenom: "Alice",
      nom: "Duval",
      username: "alice",
      role: "VISITEUR",
    });

    expect(user.id).toBe("uuid-123");
    expect(user.prenom).toBe("Alice");
    expect(user.nom).toBe("Duval");
    expect(user.username).toBe("alice");
    expect(user.role).toBe("VISITEUR");
  });

  it("le DEFAULT_ROLE est VISITEUR", () => {
    expect(DEFAULT_ROLE).toBe("VISITEUR");
  });

  it("l'id est compatible avec UserId branded type", () => {
    const user = createUser({
      id: "uuid-456",
      prenom: "Bob",
      nom: "Martin",
      username: "bob",
      role: "VISITEUR",
    });

    const userId = UserId("uuid-456");
    expect(user.id).toBe(userId);
  });

  it("accepte tous les rôles valides", () => {
    const roles = ["VISITEUR", "CONTRIBUTEUR", "PORTEUR DE PROJET", "ADMINISTRATEUR"] as const;
    roles.forEach((role) => {
      const user = createUser({ id: "x", prenom: "a", nom: "b", username: "c", role });
      expect(user.role).toBe(role);
    });
  });

  describe("isUserRole", () => {
    it("retourne true pour les rôles valides", () => {
      expect(isUserRole("VISITEUR")).toBe(true);
      expect(isUserRole("CONTRIBUTEUR")).toBe(true);
      expect(isUserRole("PORTEUR DE PROJET")).toBe(true);
      expect(isUserRole("ADMINISTRATEUR")).toBe(true);
    });

    it("retourne false pour les valeurs invalides", () => {
      expect(isUserRole("SUPER_ADMIN")).toBe(false);
      expect(isUserRole("")).toBe(false);
      expect(isUserRole(null)).toBe(false);
      expect(isUserRole(42)).toBe(false);
      expect(isUserRole(undefined)).toBe(false);
    });
  });
});
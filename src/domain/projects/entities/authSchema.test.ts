import { loginSchema, registerSchema } from "../../types/auth";

describe("loginSchema", () => {
  it("accepte des identifiants valides", () => {
    const result = loginSchema.safeParse({ username: "alice", password: "secret" });
    expect(result.success).toBe(true);
  });

  it("refuse un username vide", () => {
    const result = loginSchema.safeParse({ username: "", password: "secret" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["username"]);
      expect(result.error.issues[0].message).toBe("loginForm.errors.usernameRequired");
    }
  });

  it("refuse un password vide", () => {
    const result = loginSchema.safeParse({ username: "alice", password: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["password"]);
      expect(result.error.issues[0].message).toBe("loginForm.errors.passwordRequired");
    }
  });

  it("refuse les deux champs vides", () => {
    const result = loginSchema.safeParse({ username: "", password: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(2);
    }
  });
});

describe("registerSchema", () => {
  const validData = {
    prenom: "Alice",
    nom: "Duval",
    username: "alice_01",
    password: "secret123",
  };

  it("accepte des données valides", () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("refuse un prénom vide", () => {
    const result = registerSchema.safeParse({ ...validData, prenom: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["prenom"]);
      expect(result.error.issues[0].message).toBe("registerForm.errors.prenomRequired");
    }
  });

  it("refuse un nom vide", () => {
    const result = registerSchema.safeParse({ ...validData, nom: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["nom"]);
      expect(result.error.issues[0].message).toBe("registerForm.errors.nomRequired");
    }
  });

  it("refuse un username de moins de 3 caractères", () => {
    const result = registerSchema.safeParse({ ...validData, username: "ab" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["username"]);
      expect(result.error.issues[0].message).toBe("registerForm.errors.usernameMinLength");
    }
  });

  it("refuse un username avec des caractères spéciaux", () => {
    const result = registerSchema.safeParse({ ...validData, username: "ali ce!" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const usernameIssue = result.error.issues.find((i) => i.path[0] === "username");
      expect(usernameIssue?.message).toBe("registerForm.errors.usernameInvalidChars");
    }
  });

  it("refuse un password de moins de 6 caractères", () => {
    const result = registerSchema.safeParse({ ...validData, password: "abc" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["password"]);
      expect(result.error.issues[0].message).toBe("registerForm.errors.passwordMinLength");
    }
  });

  it("accepte un username avec underscore", () => {
    const result = registerSchema.safeParse({ ...validData, username: "alice_01" });
    expect(result.success).toBe(true);
  });
});
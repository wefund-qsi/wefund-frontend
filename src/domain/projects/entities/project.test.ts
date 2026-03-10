import { projectSchema, ProjectId } from "./project";

describe("ProjectId", () => {
  it("crée un ProjectId à partir d'une string", () => {
    const id = ProjectId("abc-123");
    expect(id).toBe("abc-123");
  });
});

describe("projectSchema", () => {
  it("accepte un projet valide", () => {
    const result = projectSchema.safeParse({
      title: "Mon projet",
      description: "Une description",
      photoUrl: "https://example.com/photo.jpg",
    });

    expect(result.success).toBe(true);
  });

  it("refuse un titre vide", () => {
    const result = projectSchema.safeParse({
      title: "",
      description: "Une description",
      photoUrl: "https://example.com/photo.jpg",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["title"]);
      expect(result.error.issues[0].message).toBe("projectForm.errors.titleRequired");
    }
  });

  it("refuse une description vide", () => {
    const result = projectSchema.safeParse({
      title: "Mon projet",
      description: "",
      photoUrl: "https://example.com/photo.jpg",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["description"]);
      expect(result.error.issues[0].message).toBe("projectForm.errors.descriptionRequired");
    }
  });

  it("refuse une URL photo vide", () => {
    const result = projectSchema.safeParse({
      title: "Mon projet",
      description: "Une description",
      photoUrl: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["photoUrl"]);
      expect(result.error.issues[0].message).toBe("projectForm.errors.photoUrlRequired");
    }
  });

  it("refuse une URL photo invalide", () => {
    const result = projectSchema.safeParse({
      title: "Mon projet",
      description: "Une description",
      photoUrl: "pas-une-url",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["photoUrl"]);
      expect(result.error.issues[0].message).toBe("projectForm.errors.photoUrlInvalid");
    }
  });

  it("refuse tous les champs vides", () => {
    const result = projectSchema.safeParse({
      title: "",
      description: "",
      photoUrl: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("title");
      expect(paths).toContain("description");
      expect(paths).toContain("photoUrl");
    }
  });
});
import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryProjectRepository } from "../adapters/project-repository.in-memory";
import { ProjectId, type Project } from "../entities/project";
import { UserId } from "../../users/entities/user";
import { ProjectNotFoundException } from "../exceptions/project-not-found";
import { UpdateProject } from "./update-project";

const makeProject = (id: string, overrides: Partial<Project> = {}): Project => ({
    id: ProjectId(id),
    title: "Mon projet",
    description: "Une description",
    photoUrl: "https://example.com/photo.jpg",
    ownerId: UserId("user-1"),
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
});

describe("UpdateProject", () => {
    let repository: InMemoryProjectRepository;
    let updateProject: UpdateProject;

    beforeEach(() => {
        repository = new InMemoryProjectRepository([makeProject("project-1")]);
        updateProject = new UpdateProject(repository);
    });

    it("met à jour le titre du projet", async () => {
        const updated = makeProject("project-1", { title: "Nouveau titre" });

        const result = await updateProject.execute(updated);

        expect(result.title).toBe("Nouveau titre");
    });

    it("met à jour la description du projet", async () => {
        const updated = makeProject("project-1", { description: "Nouvelle description" });

        const result = await updateProject.execute(updated);

        expect(result.description).toBe("Nouvelle description");
    });

    it("retourne le projet mis à jour", async () => {
        const updated = makeProject("project-1", {
            title: "Nouveau titre",
            description: "Nouvelle description",
        });

        const result = await updateProject.execute(updated);

        expect(result.id).toBe("project-1");
        expect(result.title).toBe("Nouveau titre");
        expect(result.description).toBe("Nouvelle description");
    });

    it("lève une ProjectNotFoundException si le projet n'existe pas", async () => {
        const inexistant = makeProject("inexistant");

        await expect(
            updateProject.execute(inexistant)
        ).rejects.toThrow(ProjectNotFoundException);
    });

    it("lève une erreur avec l'id du projet manquant", async () => {
        const inexistant = makeProject("inexistant");

        await expect(
            updateProject.execute(inexistant)
        ).rejects.toThrow("inexistant");
    });
});
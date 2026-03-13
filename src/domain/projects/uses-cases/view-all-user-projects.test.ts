import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryProjectRepository } from "../adapters/project-repository.in-memory";
import { ProjectId, type Project } from "../entities/project";
import { UserId } from "../../users/entities/user";
import { ViawAllUserProject } from "./view-all-user-projects";

const makeProject = (id: string, ownerId: string): Project => ({
    id: ProjectId(id),
    title: "Mon projet",
    description: "Une description",
    photoUrl: "https://example.com/photo.jpg",
    ownerId: UserId(ownerId),
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
});

describe("ViawAllUserProject", () => {
    let repository: InMemoryProjectRepository;
    let viewAllUserProjects: ViawAllUserProject;

    beforeEach(() => {
        repository = new InMemoryProjectRepository();
        viewAllUserProjects = new ViawAllUserProject(repository);
    });

    it("retourne une liste vide si l'utilisateur n'a aucun projet", async () => {
        const result = await viewAllUserProjects.execute(UserId("user-1"));

        expect(result.isSuccess).toBe(true);
        if (!result.isSuccess) return;
        expect(result.value).toEqual([]);
    });

    it("retourne uniquement les projets de l'utilisateur ciblé", async () => {
        repository = new InMemoryProjectRepository([
            makeProject("project-1", "user-1"),
            makeProject("project-2", "user-2"),
            makeProject("project-3", "user-1"),
        ]);
        viewAllUserProjects = new ViawAllUserProject(repository);

        const result = await viewAllUserProjects.execute(UserId("user-1"));

        expect(result.isSuccess).toBe(true);
        if (!result.isSuccess) return;
        expect(result.value).toHaveLength(2);
        expect(result.value.every(p => p.ownerId === "user-1")).toBe(true);
    });

    it("ne retourne pas les projets des autres utilisateurs", async () => {
        repository = new InMemoryProjectRepository([
            makeProject("project-1", "user-2"),
        ]);
        viewAllUserProjects = new ViawAllUserProject(repository);

        const result = await viewAllUserProjects.execute(UserId("user-1"));

        expect(result.isSuccess).toBe(true);
        if (!result.isSuccess) return;
        expect(result.value).toHaveLength(0);
    });

    it("retourne les projets avec les bonnes données", async () => {
        const expected = makeProject("project-1", "user-1");
        repository = new InMemoryProjectRepository([expected]);
        viewAllUserProjects = new ViawAllUserProject(repository);

        const result = await viewAllUserProjects.execute(UserId("user-1"));

        expect(result.isSuccess).toBe(true);
        if (!result.isSuccess) return;
        expect(result.value[0]).toEqual(expected);
    });
});
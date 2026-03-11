import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryProjectRepository } from "../adapters/project-repository.in-memory";
import { ProjectId, type Project } from "../entities/project";
import { UserId } from "../../users/entities/user";
import { ViewAllProjects } from "./view-all-projects";

const makeProject = (id: string): Project => ({
    id: ProjectId(id),
    title: "Mon projet",
    description: "Une description",
    photoUrl: "https://example.com/photo.jpg",
    ownerId: UserId("user-1"),
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
});

describe("ViewAllProjects", () => {
    let repository: InMemoryProjectRepository;
    let viewAllProjects: ViewAllProjects;

    beforeEach(() => {
        repository = new InMemoryProjectRepository();
        viewAllProjects = new ViewAllProjects(repository);
    });

    it("retourne une liste vide si aucun projet n'existe", async () => {
        const projects = await viewAllProjects.execute();

        expect(projects).toEqual([]);
    });

    it("retourne tous les projets existants", async () => {
        repository = new InMemoryProjectRepository([
            makeProject("project-1"),
            makeProject("project-2"),
        ]);
        viewAllProjects = new ViewAllProjects(repository);

        const projects = await viewAllProjects.execute();

        expect(projects).toHaveLength(2);
    });

    it("retourne les projets avec les bonnes données", async () => {
        const expected = makeProject("project-1");
        repository = new InMemoryProjectRepository([expected]);
        viewAllProjects = new ViewAllProjects(repository);

        const projects = await viewAllProjects.execute();

        expect(projects[0]).toEqual(expected);
    });
});
import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryProjectRepository } from "../adapters/project-repository.in-memory";
import { ProjectId, type Project } from "../entities/project";
import { UserId } from "../../users/entities/user";
import { ProjectNotFoundException } from "../exceptions/project-not-found";
import { DeleteProject } from "./delete-project";

const makeProject = (id: string): Project => ({
    id: ProjectId(id),
    title: "Mon projet",
    description: "Une description",
    photoUrl: "https://example.com/photo.jpg",
    ownerId: UserId("user-1"),
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
});

describe("DeleteProject", () => {
    let repository: InMemoryProjectRepository;
    let deleteProject: DeleteProject;

    beforeEach(() => {
        repository = new InMemoryProjectRepository([makeProject("project-1")]);
        deleteProject = new DeleteProject(repository);
    });

    it("supprime le projet existant", async () => {
        await deleteProject.execute(ProjectId("project-1"));

        const projects = await repository.findAll();
        expect(projects).toHaveLength(0);
    });

    it("lève une ProjectNotFoundException si le projet n'existe pas", async () => {
        await expect(
            deleteProject.execute(ProjectId("inexistant"))
        ).rejects.toThrow(ProjectNotFoundException);
    });

    it("lève une erreur avec l'id du projet manquant", async () => {
        await expect(
            deleteProject.execute(ProjectId("inexistant"))
        ).rejects.toThrow("inexistant");
    });

    it("ne supprime que le projet ciblé", async () => {
        repository = new InMemoryProjectRepository([
            makeProject("project-1"),
            makeProject("project-2"),
        ]);
        deleteProject = new DeleteProject(repository);

        await deleteProject.execute(ProjectId("project-1"));

        const projects = await repository.findAll();
        expect(projects).toHaveLength(1);
        expect(projects[0].id).toBe("project-2");
    });
});
import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryProjectRepository } from "../adapters/project-repository.in-memory";
import { ProjectId, type Project } from "../entities/project";
import { UserId } from "../../users/entities/user";
import { ViewProject } from "./view-project";

const makeProject = (id: string): Project => ({
    id: ProjectId(id),
    title: "Mon projet",
    description: "Une description",
    photoUrl: "https://example.com/photo.jpg",
    ownerId: UserId("user-1"),
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
});

describe("ViewProject", () => {
    let repository: InMemoryProjectRepository;
    let viewProject: ViewProject;

    beforeEach(() => {
        repository = new InMemoryProjectRepository();
        viewProject = new ViewProject(repository);
    });

    it("retourne le projet correspondant à l'ID", async () => {
        const expectedProject = makeProject("project-1");
        repository = new InMemoryProjectRepository([
            expectedProject,
            makeProject("project-2"),
        ]);
        viewProject = new ViewProject(repository);

        const project = await viewProject.execute(ProjectId("project-1"));

        expect(project).toEqual(expectedProject);
    });

    it("retourne null si le projet n'existe pas", async () => {
        repository = new InMemoryProjectRepository([
            makeProject("project-1"),
        ]);
        viewProject = new ViewProject(repository);

        const project = await viewProject.execute(ProjectId("unknown-project"));

        expect(project).toBeNull();
    });
});

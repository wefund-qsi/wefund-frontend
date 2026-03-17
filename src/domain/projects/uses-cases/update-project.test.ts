import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryProjectRepository } from "../adapters/project-repository.in-memory";
import { ProjectId } from "../entities/project";
import { ProjectNotFoundException } from "../exceptions/project-not-found";
import { UpdateProject } from "./update-project";
import { UserId } from "../../users/entities/user";

describe("UpdateProject", () => {
    let repository: InMemoryProjectRepository;
    let updateProject: UpdateProject;

    beforeEach(() => {
        repository = new InMemoryProjectRepository([
            {
                id: ProjectId("project-1"),
                title: "Projet initial",
                description: "Description initiale",
                photoUrl: "https://example.com/initial.jpg",
                ownerId: UserId("user-1"),
                createdAt: new Date("2026-01-01T00:00:00.000Z"),
            },
        ]);
        updateProject = new UpdateProject(repository);
    });

    it("met a jour le projet cible", async () => {
        const result = await updateProject.execute({
            id: ProjectId("project-1"),
            values: {
                title: "Projet modifie",
                description: "Nouvelle description",
                photoUrl: "https://example.com/updated.jpg",
            },
        });

        expect(result.title).toBe("Projet modifie");
        expect(result.description).toBe("Nouvelle description");
        expect(result.photoUrl).toBe("https://example.com/updated.jpg");
    });

    it("leve une erreur si le projet n'existe pas", async () => {
        await expect(
            updateProject.execute({
                id: ProjectId("missing-project"),
                values: {
                    title: "Projet modifie",
                    description: "Nouvelle description",
                    photoUrl: "https://example.com/updated.jpg",
                },
            }),
        ).rejects.toThrow(ProjectNotFoundException);
    });
});

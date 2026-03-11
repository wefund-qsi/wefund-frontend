import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryProjectRepository } from "../adapters/project-repository.in-memory";
import type { IIdGenerator } from "../../../core/ports/id-generator.interface";
import type { IDateGenerator } from "../../../core/ports/date-generator.interface";
import { UserId } from "../../users/entities/user";
import { CreateProject } from "./create-project";

const FIXED_ID = "fixed-id-123";
const FIXED_DATE = new Date("2026-01-01T00:00:00.000Z");

const stubIdGenerator: IIdGenerator = {
    generate: () => FIXED_ID,
};

const stubDateGenerator: IDateGenerator = {
    now: () => FIXED_DATE,
};

describe("CreateProject", () => {
    let repository: InMemoryProjectRepository;
    let createProject: CreateProject;

    beforeEach(() => {
        repository = new InMemoryProjectRepository();
        createProject = new CreateProject(repository, stubIdGenerator, stubDateGenerator);
    });

    it("crée un projet avec les données fournies", async () => {
        const data = {
            title: "Mon projet",
            description: "Une description",
            photoUrl: "https://example.com/photo.jpg",
            ownerId: UserId("user-1"),
        };

        const project = await createProject.execute(data);

        expect(project.title).toBe(data.title);
        expect(project.description).toBe(data.description);
        expect(project.photoUrl).toBe(data.photoUrl);
        expect(project.ownerId).toBe(data.ownerId);
    });

    it("assigne l'id généré au projet", async () => {
        const data = {
            title: "Mon projet",
            description: "Une description",
            photoUrl: "https://example.com/photo.jpg",
            ownerId: UserId("user-1"),
        };

        const project = await createProject.execute(data);

        expect(project.id).toBe(FIXED_ID);
    });

    it("assigne la date générée au projet", async () => {
        const data = {
            title: "Mon projet",
            description: "Une description",
            photoUrl: "https://example.com/photo.jpg",
            ownerId: UserId("user-1"),
        };

        const project = await createProject.execute(data);

        expect(project.createdAt).toBe(FIXED_DATE);
    });

    it("persiste le projet dans le repository", async () => {
        const data = {
            title: "Mon projet",
            description: "Une description",
            photoUrl: "https://example.com/photo.jpg",
            ownerId: UserId("user-1"),
        };

        await createProject.execute(data);

        const projects = await repository.findAll();
        expect(projects).toHaveLength(1);
        expect(projects[0].title).toBe(data.title);
    });
});
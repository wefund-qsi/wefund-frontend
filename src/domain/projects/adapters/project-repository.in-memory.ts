import type { IDateGenerator } from "../../../core/ports/date-generator.interface";
import type { IIdGenerator } from "../../../core/ports/id-generator.interface";
import type { Result } from "../../../shared/result";
import type { UserId } from "../../users/entities/user";
import { ProjectId, type Project } from "../entities/project";
import type { IProjectRepository } from "../ports/project-repository.interface";

export class InMemoryProjectRepository implements IProjectRepository {
    private readonly idGenerator: IIdGenerator;
    private readonly dateGenerator: IDateGenerator;
    private projects: Project[];
    

    constructor(projects: Project[] = [], idGenerator: IIdGenerator, dateGenerator: IDateGenerator) {
        this.projects = projects;
        this.idGenerator = idGenerator;
        this.dateGenerator = dateGenerator;
    }

    findAll(): Promise<Result<Project[], Error>> {
        return Promise.resolve({ isSuccess: true, value: this.projects });
    }

    create(project: Omit<Project, "id" | "createdAt">): Promise<Result<Project, Error>> {
        const newProject: Project = {
            ...project,
            id: ProjectId(this.idGenerator.generate()),
            createdAt: this.dateGenerator.now(),
        };
        this.projects.push(newProject);
        return Promise.resolve({ isSuccess: true, value: newProject });
    }

    delete(id: ProjectId): Promise<Result<void, Error>> {
        const index = this.projects.findIndex(project => project.id === id);
        if (index === -1) {
            return Promise.resolve({ isSuccess: false, error: new Error(`Project with id ${id} not found`) });
        }
        this.projects = this.projects.filter(project => project.id !== id);
        return Promise.resolve({ isSuccess: true, value: undefined });
    }

    findAllByUserId(id: UserId): Promise<Result<Project[], Error>> {
        return Promise.resolve({ isSuccess: true, value: this.projects.filter(project => project.ownerId === id) });
    }
}
import type { UserId } from "../../users/entities/user";
import { ProjectId, type Project } from "../entities/project";
import type { IProjectRepository } from "../ports/project-repository.interface";

export class InMemoryProjectRepository implements IProjectRepository {
    private projects: Project[];

    constructor(projects: Project[] = []) {
        this.projects = projects;
    }

    findAll(): Promise<Project[]> {
        return Promise.resolve(this.projects);
    }

    findById(id: ProjectId): Promise<Project | null> {
        return Promise.resolve(this.projects.find(project => project.id === id) || null);
    }

    create(project: Project): Promise<Project> {
        this.projects.push(project);
        return Promise.resolve(project);
    }

    update(project: Project): Promise<Project> {
        this.projects = this.projects.map((currentProject) =>
            currentProject.id === project.id ? project : currentProject,
        );
        return Promise.resolve(project);
    }

    delete(id: ProjectId): Promise<boolean> {
        const index = this.projects.findIndex(project => project.id === id);
        if (index === -1) {
            return Promise.resolve(false);
        }
        this.projects = this.projects.filter(project => project.id !== id);
        return Promise.resolve(true);
    }

    findAllByUserId(id: UserId): Promise<Project[]> {
        return Promise.resolve(this.projects.filter(project => project.ownerId === id));
    }
}

import { ProjectId, type Project } from "../entities/project";
import type { IProjectRepository } from "../ports/project-repository.interface";

export class InMemoryProjectRepository implements IProjectRepository {
    private projects: Project[];

    constructor(projects: Project[] = []) {
        this.projects = projects;
    }

    async findAll(): Promise<Project[]> {
        return this.projects;
    }

    async create(project: Project): Promise<Project> {
        this.projects.push(project);
        return project;
    }

    async update(project: Project): Promise<Project | null> {
        const index = this.projects.findIndex(p => p.id === project.id);
        if (index === -1) {
            return null;
        }
        this.projects[index] = { ...this.projects[index], ...project };
        return this.projects[index];
    }

    async delete(id: ProjectId): Promise<Boolean> {
        const index = this.projects.findIndex(project => project.id === id);
        if (index === -1) {
            return false;
        }
        this.projects = this.projects.filter(project => project.id !== id);
        return true;
    }
}
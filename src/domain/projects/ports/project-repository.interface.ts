import type { CreateProjectData, Project, ProjectId } from "../entities/project";

export interface IProjectRepository {
    findAll(): Promise<Project[]>;
    findById(id: ProjectId): Promise<Project | null>;
    create(project: Project): Promise<Project>;
    update(project: Project): Promise<Project | null>;
    delete(id: ProjectId): Promise<Boolean>;
}
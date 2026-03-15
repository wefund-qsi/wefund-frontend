import type { UserId } from "../../users/entities/user";
import type { Project, ProjectId } from "../entities/project";

export interface IProjectRepository {
    findAll(): Promise<Project[]>;
    findById(id: ProjectId): Promise<Project | null>;
    create(project: Project): Promise<Project>;
    delete(id: ProjectId): Promise<boolean>;
    findAllByUserId(id: UserId): Promise<Project[]>;
}
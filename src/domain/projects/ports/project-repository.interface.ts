import type { UserId } from "../../users/entities/user";
import type { Project, ProjectId } from "../entities/project";

export interface IProjectRepository {
    findAll(): Promise<Project[]>;
    create(project: Project): Promise<Project>;
    update(project: Project): Promise<Project | null>;
    delete(id: ProjectId): Promise<boolean>;
    findAllByUserId(id: UserId): Promise<Project[]>;
}
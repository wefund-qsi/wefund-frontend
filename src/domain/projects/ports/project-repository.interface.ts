import type { UserId } from "../../users/entities/user";
import type { Result } from "../../../shared/result";
import type { Project, ProjectId } from "../entities/project";

export interface IProjectRepository {
    findAll(): Promise<Result<Project[], Error>>;
    create(project: Omit<Project, "id" | "createdAt">): Promise<Result<Project, Error>>;
    delete(id: ProjectId): Promise<Result<void, Error>>;
    findAllByUserId(id: UserId): Promise<Result<Project[], Error>>;
}
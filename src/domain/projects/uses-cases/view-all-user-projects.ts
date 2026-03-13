import type { Executable } from "../../../shared/executable";
import type { Result } from "../../../shared/result";
import type { UserId } from "../../users/entities/user";
import type { Project } from "../entities/project";
import type { IProjectRepository } from "../ports/project-repository.interface";

export class ViawAllUserProject implements Executable<UserId, Result<Project[], Error>> {
    private readonly projectRepository: IProjectRepository;

    constructor(projectRepository: IProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(id: UserId): Promise<Result<Project[], Error>> {
        return await this.projectRepository.findAllByUserId(id);
    }
}
import type { Executable } from "../../../shared/executable";
import type { UserId } from "../../users/entities/user";
import type { Project } from "../entities/project";
import type { IProjectRepository } from "../ports/project-repository.interface";

export class ViawAllUserProject implements Executable<UserId, Project[]> {
    private readonly projectRepository: IProjectRepository;

    constructor(projectRepository: IProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(id: UserId): Promise<Project[]> {
        return await this.projectRepository.findAllByUserId(id);
    }
}
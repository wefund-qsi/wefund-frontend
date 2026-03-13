import type { Executable } from "../../../shared/executable";
import type { Result } from "../../../shared/result";
import type { Project } from "../entities/project";
import type { IProjectRepository } from "../ports/project-repository.interface";

export class ViewAllProjects implements Executable<void, Result<Project[], Error>> {
    private readonly projectRepository: IProjectRepository;

    constructor(projectRepository: IProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(): Promise<Result<Project[], Error>> {
        return await this.projectRepository.findAll();
    }
}
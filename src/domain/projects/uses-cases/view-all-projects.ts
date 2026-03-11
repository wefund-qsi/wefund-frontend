import type { Executable } from "../../../shared/executable";
import type { Project } from "../entities/project";
import type { IProjectRepository } from "../ports/project-repository.interface";

export class ViewAllProjects implements Executable<void, Project[]> {
    private readonly projectRepository: IProjectRepository;

    constructor(projectRepository: IProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(): Promise<Project[]> {
        return await this.projectRepository.findAll();
    }
}
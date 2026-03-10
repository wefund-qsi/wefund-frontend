import type { Executable } from "../../../shared/executable";
import { ProjectId, type Project } from "../entities/project";
import { ProjectNotFoundException } from "../exceptions/project-not-found";
import type { IProjectRepository } from "../ports/project-repository.interface";

export class UpdateProject implements Executable<ProjectId, Project> {
    private readonly projectRepository: IProjectRepository;
    
    constructor(projectRepository: IProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(id: ProjectId): Promise<Project> {
        const project = await this.projectRepository.findById(id);

        if (!project) {
            throw new ProjectNotFoundException(id);
        }

        return project;
    }
}
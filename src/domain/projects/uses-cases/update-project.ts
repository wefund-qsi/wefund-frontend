import type { Executable } from "../../../shared/executable";
import type { Project } from "../entities/project";
import { ProjectNotFoundException } from "../exceptions/project-not-found";
import type { IProjectRepository } from "../ports/project-repository.interface";

export class UpdateProject implements Executable<Project, Project> {
    private readonly projectRepository: IProjectRepository;
    
    constructor(projectRepository: IProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(data: Project): Promise<Project> {
        const project = await this.projectRepository.update(data);

        if (!project) {
            throw new ProjectNotFoundException(data.id);
        }

        return project;
    }
}
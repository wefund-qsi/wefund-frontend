import type { Project, ProjectId } from "../entities/project";
import type { IProjectRepository } from "../ports/project-repository.interface";

export class ViewProject {
    private readonly projectRepository: IProjectRepository;

    constructor(projectRepository: IProjectRepository) {
        this.projectRepository = projectRepository;
    }

    execute(id: ProjectId): Promise<Project | null> {
        return this.projectRepository.findById(id);
    }
}

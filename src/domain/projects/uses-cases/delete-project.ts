import type { Executable } from "../../../shared/executable";
import type { ProjectId } from "../entities/project";
import { ProjectNotFoundException } from "../exceptions/project-not-found";
import type { IProjectRepository } from "../ports/project-repository.interface";

export class DeleteProject implements Executable<ProjectId, void> {
    private readonly projectRepository: IProjectRepository;

    constructor(projectRepository: IProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(id: ProjectId): Promise<void> {
        const success = await this.projectRepository.delete(id)
        if(!success) {
            throw new ProjectNotFoundException(id);
        }
    }
}
import type { Executable } from "../../../shared/executable";
import type { Result } from "../../../shared/result";
import type { ProjectId } from "../entities/project";
import { ProjectNotFoundException } from "../exceptions/project-not-found";
import type { IProjectRepository } from "../ports/project-repository.interface";

export class DeleteProject implements Executable<ProjectId, Result<void, Error>> {
    private readonly projectRepository: IProjectRepository;

    constructor(projectRepository: IProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(id: ProjectId): Promise<Result<void, Error>> {
        const result = await this.projectRepository.delete(id);
        if (!result.isSuccess) {
            return { isSuccess: false, error: new ProjectNotFoundException(id) };
        }
        return { isSuccess: true, value: undefined };
    }
}
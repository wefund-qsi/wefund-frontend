import type { Executable } from "../../../shared/executable";
import type { Result } from "../../../shared/result";
import type { Project } from "../entities/project";
import type { IProjectRepository } from "../ports/project-repository.interface";

export class CreateProject implements Executable<Omit<Project, "id" | "createdAt">, Result<Project, Error>> {
    private readonly projectRepository: IProjectRepository;

    constructor(projectRepository: IProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(data: Omit<Project, "id" | "createdAt">): Promise<Result<Project, Error>> {   
        return await this.projectRepository.create(data);
    }
}
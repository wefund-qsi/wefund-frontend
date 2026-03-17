import type { Executable } from "../../../shared/executable";
import type { Project, ProjectId, ProjectFormValues } from "../entities/project";
import { ProjectNotFoundException } from "../exceptions/project-not-found";
import type { IProjectRepository } from "../ports/project-repository.interface";

export class UpdateProject implements Executable<{ id: ProjectId; values: ProjectFormValues }, Project> {
    private readonly projectRepository: IProjectRepository;

    constructor(projectRepository: IProjectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute({ id, values }: { id: ProjectId; values: ProjectFormValues }): Promise<Project> {
        const project = await this.projectRepository.findById(id);

        if (!project) {
            throw new ProjectNotFoundException(id);
        }

        return this.projectRepository.update({
            ...project,
            ...values,
        });
    }
}

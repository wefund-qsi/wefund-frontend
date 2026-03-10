import type { IDateGenerator } from "../../../core/ports/date-generator.interface";
import type { IIdGenerator } from "../../../core/ports/id-generator.interface";
import type { Executable } from "../../../shared/executable";
import { ProjectId, type Project } from "../entities/project";
import type { IProjectRepository } from "../ports/project-repository.interface";

export class CreateProject implements Executable<Omit<Project, "id" | "createdAt">, Project> {
    private readonly projectRepository: IProjectRepository;
    private readonly idGenerator: IIdGenerator;
    private readonly dateGenerator: IDateGenerator;

    constructor(projectRepository: IProjectRepository, idGenerator: IIdGenerator, dateGenerator: IDateGenerator) {
        this.projectRepository = projectRepository;
        this.idGenerator = idGenerator;
        this.dateGenerator = dateGenerator;
    }

    async execute(data: Omit<Project, "id" | "createdAt">): Promise<Project> {   
        const id = ProjectId(this.idGenerator.generate());
        const date = this.dateGenerator.now();

        const newProject: Project = {
            id,
            title: data.title,
            description: data.description,
            photoUrl: data.photoUrl,
            ownerId: data.ownerId,
            createdAt: date,
        };

        return await this.projectRepository.create(newProject);
    }
}
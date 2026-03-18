import type { IDateGenerator } from "../../../core/ports/date-generator.interface";
import type { IIdGenerator } from "../../../core/ports/id-generator.interface";
import type { Executable } from "../../../shared/executable";
import type { ProjectId } from "../../projects/entities/project";
import { CampaignId, type Campaign, type CampaignFormValues, type DraftCampaign } from "../entites/campaign";
import type { ICampaignRepository } from "../ports/campaign-repository.interface";
import type { UserId } from "../../users/entities/user";

type CreateCampaignPayload = CampaignFormValues & {
    ownerId: UserId;
    projectId: ProjectId;
};

export class CreateCampaign implements Executable<CreateCampaignPayload, Campaign> {
    private readonly campaignRepository: ICampaignRepository;
    private readonly idGenerator: IIdGenerator;
    private readonly dateGenerator: IDateGenerator;

    constructor(campaignRepository: ICampaignRepository, idGenerator: IIdGenerator, dateGenerator: IDateGenerator) {
        this.campaignRepository = campaignRepository;
        this.idGenerator = idGenerator;
        this.dateGenerator = dateGenerator;
    }

    async execute(data: CreateCampaignPayload): Promise<Campaign> {
        const campaign: DraftCampaign = {
            id: CampaignId(this.idGenerator.generate()),
            projectId: data.projectId,
            title: data.title,
            description: data.description,
            goal: data.goal,
            endDate: data.endDate,
            ownerId: data.ownerId,
            createdAt: this.dateGenerator.now().toISOString(),
            status: "BROUILLON",
        };

        return this.campaignRepository.create(campaign);
    }
}

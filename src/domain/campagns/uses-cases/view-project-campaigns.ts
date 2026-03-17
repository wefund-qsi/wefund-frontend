import type { Executable } from "../../../shared/executable";
import type { ProjectId } from "../../projects/entities/project";
import type { Campaign } from "../entites/campaign";
import type { ICampaignRepository } from "../ports/campaign-repository.interface";

export class ViewProjectCampaigns implements Executable<ProjectId, Campaign[]> {
    private readonly campaignRepository: ICampaignRepository;

    constructor(campaignRepository: ICampaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    execute(projectId: ProjectId): Promise<Campaign[]> {
        return this.campaignRepository.findByProjectId(projectId);
    }
}

import type { Campaign, CampaignId } from "../entites/campaign";
import type { ICampaignRepository } from "../ports/campaign-repository.interface";

export class ViewCampaign {
    private readonly campaignRepository: ICampaignRepository;

    constructor(campaignRepository: ICampaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    execute(id: CampaignId): Promise<Campaign | null> {
        return this.campaignRepository.findById(id);
    }
}

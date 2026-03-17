import type { Executable } from "../../../shared/executable";
import type { Campaign } from "../entites/campaign";
import type { ICampaignRepository } from "../ports/campaign-repository.interface";

export class ViewAllCampaigns implements Executable<void, Campaign[]> {
    private readonly campaignRepository: ICampaignRepository;

    constructor(campaignRepository: ICampaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    execute(): Promise<Campaign[]> {
        return this.campaignRepository.findAll();
    }
}

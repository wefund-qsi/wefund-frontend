import type { Executable } from "../../../shared/executable";
import type { CampaignId } from "../entites/campaign";
import { CampaignNotFoundException } from "../exceptions/campaign-not-found";
import type { ICampaignRepository } from "../ports/campaign-repository.interface";

export class DeleteCampaign implements Executable<CampaignId, void> {
    private readonly campaignRepository: ICampaignRepository;

    constructor(campaignRepository: ICampaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    async execute(id: CampaignId): Promise<void> {
        const success = await this.campaignRepository.delete(id);

        if (!success) {
            throw new CampaignNotFoundException(id);
        }
    }
}

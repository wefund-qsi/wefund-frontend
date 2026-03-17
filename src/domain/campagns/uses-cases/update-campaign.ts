import type { Executable } from "../../../shared/executable";
import type { Campaign, CampaignFormValues, CampaignId } from "../entites/campaign";
import { CampaignNotFoundException } from "../exceptions/campaign-not-found";
import type { ICampaignRepository } from "../ports/campaign-repository.interface";

export class UpdateCampaign implements Executable<{ id: CampaignId; values: CampaignFormValues }, Campaign> {
    private readonly campaignRepository: ICampaignRepository;

    constructor(campaignRepository: ICampaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    async execute({ id, values }: { id: CampaignId; values: CampaignFormValues }): Promise<Campaign> {
        const campaign = await this.campaignRepository.findById(id);

        if (!campaign) {
            throw new CampaignNotFoundException(id);
        }

        return this.campaignRepository.update({
            ...campaign,
            ...values,
        });
    }
}

import type { Executable } from "../../../shared/executable";
import type { Campaign, CampaignFormValues, CampaignId } from "../entites/campaign";
import { CampaignNotFoundException } from "../exceptions/campaign-not-found";
import type { ICampaignRepository } from "../ports/campaign-repository.interface";

export class UpdateCampaign implements Executable<{ id: CampaignId; values: CampaignFormValues; nextStatus?: "BROUILLON" | "EN_ATTENTE" }, Campaign> {
    private readonly campaignRepository: ICampaignRepository;

    constructor(campaignRepository: ICampaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    async execute({ id, values, nextStatus }: { id: CampaignId; values: CampaignFormValues; nextStatus?: "BROUILLON" | "EN_ATTENTE" }): Promise<Campaign> {
        const campaign = await this.campaignRepository.findById(id);

        if (!campaign) {
            throw new CampaignNotFoundException(id);
        }

        const updatedCampaign = {
            ...campaign,
            ...values,
            status: nextStatus ?? campaign.status,
        } as Campaign;

        return this.campaignRepository.update(updatedCampaign);
    }
}

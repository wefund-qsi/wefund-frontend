import type { Campaign, CampaignId } from "../entites/campaign";
import type { ICampaignRepository } from "../ports/campaign-repository.interface";

/**
 * Use-case pour consulter les détails d'une campagne
 *
 * Récupère une campagne spécifique par son ID.
 * Retourne null si la campagne n'existe pas.
 */
export class ViewCampaign {
    private readonly campaignRepository: ICampaignRepository;

    constructor(campaignRepository: ICampaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    execute(id: CampaignId): Promise<Campaign | null> {
        return this.campaignRepository.findById(id);
    }
}

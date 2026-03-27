import type { Campaign } from "../../campagns/entites/campaign";
import type { ICampaignRepository } from "../../campagns/ports/campaign-repository.interface";
import { ContributionActionForbiddenException } from "../exceptions/contribution-action-forbidden";
import { ContributionNotFoundException } from "../exceptions/contribution-not-found";
import type { ContributionId } from "../entities/contribution";
import type { IContributionRepository } from "../ports/contribution-repository.interface";

type UpdateContributionPayload = {
  contributionId: ContributionId;
  amount: number;
};

export class UpdateContribution {
  private readonly contributionRepository: IContributionRepository;
  private readonly campaignRepository: ICampaignRepository;

  constructor(contributionRepository: IContributionRepository, campaignRepository: ICampaignRepository) {
    this.contributionRepository = contributionRepository;
    this.campaignRepository = campaignRepository;
  }

  async execute({ contributionId, amount }: UpdateContributionPayload): Promise<Campaign> {
    const contribution = await this.contributionRepository.findById(contributionId);

    if (!contribution) {
      throw new ContributionNotFoundException();
    }

    const campaign = await this.campaignRepository.findById(contribution.campaignId);

    if (!campaign || campaign.status !== 'ACTIVE') {
      throw new ContributionActionForbiddenException();
    }

    // Mettre à jour la contribution via l'API
    await this.contributionRepository.update({
      ...contribution,
      amount,
    });

    const updatedCampaign = await this.campaignRepository.findById(campaign.id);

    if (!updatedCampaign) {
      throw new Error('Campagne non trouvée après mise à jour de contribution');
    }

    return updatedCampaign;
  }
}

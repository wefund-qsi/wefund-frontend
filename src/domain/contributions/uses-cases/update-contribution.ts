import type { Campaign } from "../../campagns/entites/campaign";
import type { ICampaignRepository } from "../../campagns/ports/campaign-repository.interface";
import { ContributionActionForbiddenException } from "../exceptions/contribution-action-forbidden";
import { ContributionNotFoundException } from "../exceptions/contribution-not-found";
import type { ContributionId } from "../entities/contribution";
import type { IContributionRepository } from "../ports/contribution-repository.interface";

/**
    * Use-case pour mettre à jour une contribution à une campagne de crowdfunding.
    *
    * Ce use-case vérifie que la contribution existe et que la campagne associée est active avant de procéder à la mise à jour.
    * Si la contribution n'existe pas, il lance une exception.
    * Si la campagne n'est pas active, il lance une exception.
    * Si les vérifications sont passées, il met à jour la contribution et le montant collecté de la campagne.
        */
type UpdateContributionPayload = {
  contributionId: ContributionId;
  amount: number;
};

/**
    * @param contributionRepository - Le repository pour accéder aux contributions
    * @param campaignRepository - Le repository pour accéder aux campagnes
    *
    * Ce constructeur initialise les repositories nécessaires pour exécuter le use-case de mise à jour de contribution.
    */
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

    const nextCollectedAmount = campaign.collectedAmount - contribution.amount + amount;

    await this.contributionRepository.update({
      ...contribution,
      amount,
    });

    return this.campaignRepository.update({
      ...campaign,
      collectedAmount: nextCollectedAmount,
    });
  }
}

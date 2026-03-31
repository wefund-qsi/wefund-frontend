import type { Campaign } from "../../campagns/entites/campaign";
import type { ICampaignRepository } from "../../campagns/ports/campaign-repository.interface";
import { ContributionActionForbiddenException } from "../exceptions/contribution-action-forbidden";
import { ContributionNotFoundException } from "../exceptions/contribution-not-found";
import type { ContributionId } from "../entities/contribution";
import type { IContributionRepository } from "../ports/contribution-repository.interface";

/**
    * Use-case pour rembourser une contribution à une campagne de crowdfunding.
    *
    * Ce use-case vérifie que la contribution existe et que la campagne associée est active avant de procéder au remboursement.
    * Si la contribution n'existe pas, il lance une exception.
    * Si la campagne n'est pas active, il lance une exception.
    * Si les vérifications sont passées, il supprime la contribution et met à jour le montant collecté de la campagne.
        */
export class RefundContribution {
  private readonly contributionRepository: IContributionRepository;
  private readonly campaignRepository: ICampaignRepository;

/**
    * @param contributionRepository - Le repository pour accéder aux contributions
    * @param campaignRepository - Le repository pour accéder aux campagnes
    *
    * Ce constructeur initialise les repositories nécessaires pour exécuter le use-case de remboursement de contribution.
    */
  constructor(contributionRepository: IContributionRepository, campaignRepository: ICampaignRepository) {
    this.contributionRepository = contributionRepository;
    this.campaignRepository = campaignRepository;
  }

  async execute(contributionId: ContributionId): Promise<Campaign> {
    const contribution = await this.contributionRepository.findById(contributionId);

    if (!contribution) {
      throw new ContributionNotFoundException();
    }

    const campaign = await this.campaignRepository.findById(contribution.campaignId);

    if (!campaign || campaign.status !== 'ACTIVE') {
      throw new ContributionActionForbiddenException();
    }

    await this.contributionRepository.delete(contribution.id);

    return this.campaignRepository.update({
      ...campaign,
      collectedAmount: Math.max(0, campaign.collectedAmount - contribution.amount),
    });
  }
}

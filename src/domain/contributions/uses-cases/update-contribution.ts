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

    if (!campaign || campaign.status !== "active") {
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

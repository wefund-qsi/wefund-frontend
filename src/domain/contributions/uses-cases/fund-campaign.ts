import type { IDateGenerator } from "../../../core/ports/date-generator.interface";
import type { IIdGenerator } from "../../../core/ports/id-generator.interface";
import type { Campaign, CampaignId } from "../../campagns/entites/campaign";
import { ContributionId } from "../entities/contribution";
import { CampaignNotActiveException } from "../exceptions/campaign-not-active";
import type { ICampaignRepository } from "../../campagns/ports/campaign-repository.interface";
import type { IContributionRepository } from "../ports/contribution-repository.interface";
import type { UserId } from "../../users/entities/user";

/**
    * Use-case pour financer une campagne de crowdfunding.
    *
    * Ce use-case vérifie que la campagne est active avant d'accepter une contribution.
    * Si la campagne est active, il crée une nouvelle contribution et met à jour le montant collecté de la campagne.
    * Si la campagne n'est pas active, il lance une exception.
    */
type FundCampaignPayload = {
  campaignId: CampaignId;
  contributorId: UserId;
  amount: number;
};

export class FundCampaign {
  private readonly campaignRepository: ICampaignRepository;
  private readonly contributionRepository: IContributionRepository;
  private readonly idGenerator: IIdGenerator;
  private readonly dateGenerator: IDateGenerator;

  constructor(
    campaignRepository: ICampaignRepository,
    contributionRepository: IContributionRepository,
    idGenerator: IIdGenerator,
    dateGenerator: IDateGenerator,
  ) {
    this.campaignRepository = campaignRepository;
    this.contributionRepository = contributionRepository;
    this.idGenerator = idGenerator;
    this.dateGenerator = dateGenerator;
  }

  async execute({ campaignId, contributorId, amount }: FundCampaignPayload): Promise<Campaign> {
    const campaign = await this.campaignRepository.findById(campaignId);

    if (!campaign || campaign.status !== 'ACTIVE') {
      throw new CampaignNotActiveException();
    }

    const nextCollectedAmount = campaign.collectedAmount + amount;

    await this.contributionRepository.create({
      id: ContributionId(this.idGenerator.generate()),
      campaignId,
      contributorId,
      amount,
      createdAt: this.dateGenerator.now().toISOString(),
    });

    return this.campaignRepository.update({
      ...campaign,
      collectedAmount: nextCollectedAmount,
    });
  }
}

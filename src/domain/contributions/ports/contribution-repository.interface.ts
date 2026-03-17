import type { CampaignId } from "../../campagns/entites/campaign";
import type { UserId } from "../../users/entities/user";
import type { Contribution } from "../entities/contribution";
import type { ContributionId } from "../entities/contribution";

export interface IContributionRepository {
  create(contribution: Contribution): Promise<Contribution>;
  update(contribution: Contribution): Promise<Contribution>;
  delete(id: ContributionId): Promise<boolean>;
  findById(id: ContributionId): Promise<Contribution | null>;
  findByCampaignId(campaignId: CampaignId): Promise<Contribution[]>;
  findByContributorId(contributorId: UserId): Promise<Contribution[]>;
}

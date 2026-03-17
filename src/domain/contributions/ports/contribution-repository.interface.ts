import type { CampaignId } from "../../campagns/entites/campaign";
import type { Contribution } from "../entities/contribution";

export interface IContributionRepository {
  create(contribution: Contribution): Promise<Contribution>;
  findByCampaignId(campaignId: CampaignId): Promise<Contribution[]>;
}

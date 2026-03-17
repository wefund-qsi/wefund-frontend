import type { Brand } from "../../../shared/utils";
import type { CampaignId } from "../../campagns/entites/campaign";
import type { UserId } from "../../users/entities/user";

export type ContributionId = Brand<string, "ContributionId">;
export const ContributionId = (value: string): ContributionId => value as ContributionId;

export type Contribution = {
  id: ContributionId;
  campaignId: CampaignId;
  contributorId: UserId;
  amount: number;
  createdAt: string;
};

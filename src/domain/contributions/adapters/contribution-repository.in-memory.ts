import type { CampaignId } from "../../campagns/entites/campaign";
import type { Contribution } from "../entities/contribution";
import type { IContributionRepository } from "../ports/contribution-repository.interface";

export class InMemoryContributionRepository implements IContributionRepository {
  private contributions: Contribution[];

  constructor(contributions: Contribution[] = []) {
    this.contributions = contributions;
  }

  create(contribution: Contribution): Promise<Contribution> {
    this.contributions.push(contribution);
    return Promise.resolve(contribution);
  }

  findByCampaignId(campaignId: CampaignId): Promise<Contribution[]> {
    return Promise.resolve(this.contributions.filter((contribution) => contribution.campaignId === campaignId));
  }
}

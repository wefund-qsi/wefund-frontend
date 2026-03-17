import type { CampaignId } from "../../campagns/entites/campaign";
import type { UserId } from "../../users/entities/user";
import type { Contribution, ContributionId } from "../entities/contribution";
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

  update(contribution: Contribution): Promise<Contribution> {
    this.contributions = this.contributions.map((currentContribution) =>
      currentContribution.id === contribution.id ? contribution : currentContribution,
    );
    return Promise.resolve(contribution);
  }

  delete(id: ContributionId): Promise<boolean> {
    const contributionExists = this.contributions.some((contribution) => contribution.id === id);

    if (!contributionExists) {
      return Promise.resolve(false);
    }

    this.contributions = this.contributions.filter((contribution) => contribution.id !== id);
    return Promise.resolve(true);
  }

  findById(id: ContributionId): Promise<Contribution | null> {
    return Promise.resolve(this.contributions.find((contribution) => contribution.id === id) ?? null);
  }

  findByCampaignId(campaignId: CampaignId): Promise<Contribution[]> {
    return Promise.resolve(this.contributions.filter((contribution) => contribution.campaignId === campaignId));
  }

  findByContributorId(contributorId: UserId): Promise<Contribution[]> {
    return Promise.resolve(this.contributions.filter((contribution) => contribution.contributorId === contributorId));
  }
}

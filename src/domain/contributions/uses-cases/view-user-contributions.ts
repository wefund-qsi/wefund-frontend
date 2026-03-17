import type { Executable } from "../../../shared/executable";
import type { UserId } from "../../users/entities/user";
import type { Contribution } from "../entities/contribution";
import type { IContributionRepository } from "../ports/contribution-repository.interface";

export class ViewUserContributions implements Executable<UserId, Contribution[]> {
  private readonly contributionRepository: IContributionRepository;

  constructor(contributionRepository: IContributionRepository) {
    this.contributionRepository = contributionRepository;
  }

  execute(contributorId: UserId): Promise<Contribution[]> {
    return this.contributionRepository.findByContributorId(contributorId);
  }
}

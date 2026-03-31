import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCampaignRepository } from "../../campagns/adapters/campaign-repository.in-memory";
import { CampaignId } from "../../campagns/entites/campaign";
import { ProjectId } from "../../projects/entities/project";
import { UserId } from "../../users/entities/user";
import { InMemoryContributionRepository } from "../adapters/contribution-repository.in-memory";
import { ContributionActionForbiddenException } from "../exceptions/contribution-action-forbidden";
import { ContributionId } from "../entities/contribution";
import { RefundContribution } from "./refund-contribution";

/**
    * Tests unitaires pour le use-case RefundContribution
    *
    * Vérifie que les contributions sont correctement remboursées et que le montant collecté des campagnes est mis à jour,
    * et que le remboursement est refusé pour les campagnes non actives.
    */
describe("RefundContribution", () => {
  let campaignRepository: InMemoryCampaignRepository;
  let contributionRepository: InMemoryContributionRepository;
  let refundContribution: RefundContribution;

  beforeEach(() => {
    campaignRepository = new InMemoryCampaignRepository([
      {
        id: CampaignId("campaign-1"),
        projectId: ProjectId("project-1"),
        title: "Campaign",
        description: "Description",
        goal: 1000,
        endDate: "2026-09-01",
        ownerId: UserId("owner-1"),
        createdAt: "2026-01-01T10:00:00.000Z",
        status: "ACTIVE",
        startedAt: "2026-02-01T10:00:00.000Z",
        collectedAmount: 300,
      },
    ]);
    contributionRepository = new InMemoryContributionRepository([
      {
        id: ContributionId("contribution-1"),
        campaignId: CampaignId("campaign-1"),
        contributorId: UserId("contributor-1"),
        amount: 100,
        createdAt: "2026-03-01T10:00:00.000Z",
      },
    ]);
    refundContribution = new RefundContribution(contributionRepository, campaignRepository);
  });

  it("rembourse une contribution et baisse la collecte", async () => {
    const campaign = await refundContribution.execute(ContributionId("contribution-1"));

    expect(campaign.status).toBe("ACTIVE");
    expect(campaign.status === "ACTIVE" ? campaign.collectedAmount : 0).toBe(200);
    await expect(contributionRepository.findById(ContributionId("contribution-1"))).resolves.toBeNull();
  });

  it("refuse le remboursement si la campagne n est pas active", async () => {
    const nonActiveRepository = new InMemoryCampaignRepository([
      {
        id: CampaignId("campaign-1"),
        projectId: ProjectId("project-1"),
        title: "Campaign",
        description: "Description",
        goal: 1000,
        endDate: "2026-09-01",
        ownerId: UserId("owner-1"),
        createdAt: "2026-01-01T10:00:00.000Z",
        status: "ECHOUEE",
        startedAt: "2026-02-01T10:00:00.000Z",
        completedAt: "2026-03-01T10:00:00.000Z",
        collectedAmount: 400,
      },
    ]);
    const useCase = new RefundContribution(contributionRepository, nonActiveRepository);

    await expect(useCase.execute(ContributionId("contribution-1"))).rejects.toThrow(ContributionActionForbiddenException);
  });
});

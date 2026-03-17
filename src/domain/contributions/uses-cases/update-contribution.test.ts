import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCampaignRepository } from "../../campagns/adapters/campaign-repository.in-memory";
import { CampaignId } from "../../campagns/entites/campaign";
import { ProjectId } from "../../projects/entities/project";
import { UserId } from "../../users/entities/user";
import { InMemoryContributionRepository } from "../adapters/contribution-repository.in-memory";
import { ContributionActionForbiddenException } from "../exceptions/contribution-action-forbidden";
import { ContributionId } from "../entities/contribution";
import { UpdateContribution } from "./update-contribution";

describe("UpdateContribution", () => {
  let campaignRepository: InMemoryCampaignRepository;
  let contributionRepository: InMemoryContributionRepository;
  let updateContribution: UpdateContribution;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-17T10:00:00.000Z"));

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
        status: "active",
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
    updateContribution = new UpdateContribution(contributionRepository, campaignRepository);
  });

  it("met a jour le montant et la collecte", async () => {
    const campaign = await updateContribution.execute({
      contributionId: ContributionId("contribution-1"),
      amount: 150,
    });

    expect(campaign.status).toBe("active");
    expect(campaign.status === "active" ? campaign.collectedAmount : 0).toBe(350);
  });

  it("refuse la modification si la campagne n est pas active", async () => {
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
        status: "succeeded",
        startedAt: "2026-02-01T10:00:00.000Z",
        completedAt: "2026-03-01T10:00:00.000Z",
        collectedAmount: 1200,
      },
    ]);
    const useCase = new UpdateContribution(contributionRepository, nonActiveRepository);

    await expect(
      useCase.execute({
        contributionId: ContributionId("contribution-1"),
        amount: 150,
      }),
    ).rejects.toThrow(ContributionActionForbiddenException);
  });
});

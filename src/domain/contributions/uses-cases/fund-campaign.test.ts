import { beforeEach, describe, expect, it } from "vitest";
import type { IDateGenerator } from "../../../core/ports/date-generator.interface";
import type { IIdGenerator } from "../../../core/ports/id-generator.interface";
import { CampaignId } from "../../campagns/entites/campaign";
import { InMemoryCampaignRepository } from "../../campagns/adapters/campaign-repository.in-memory";
import { ProjectId } from "../../projects/entities/project";
import { UserId } from "../../users/entities/user";
import { InMemoryContributionRepository } from "../adapters/contribution-repository.in-memory";
import { CampaignNotActiveException } from "../exceptions/campaign-not-active";
import { FundCampaign } from "./fund-campaign";

describe("FundCampaign", () => {
  let campaignRepository: InMemoryCampaignRepository;
  let contributionRepository: InMemoryContributionRepository;
  let fundCampaign: FundCampaign;

  const idGenerator: IIdGenerator = {
    generate: () => "contribution-1",
  };

  const dateGenerator: IDateGenerator = {
    now: () => new Date("2026-03-17T10:00:00.000Z"),
  };

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
        status: "active",
        startedAt: "2026-02-01T10:00:00.000Z",
        collectedAmount: 300,
      },
    ]);
    contributionRepository = new InMemoryContributionRepository();
    fundCampaign = new FundCampaign(campaignRepository, contributionRepository, idGenerator, dateGenerator);
  });

  it("incremente le montant collecte sur une campagne active", async () => {
    const result = await fundCampaign.execute({
      campaignId: CampaignId("campaign-1"),
      contributorId: UserId("contributor-1"),
      amount: 200,
    });

    expect(result.status).toBe("active");
    expect(result.status === "active" ? result.collectedAmount : 0).toBe(500);
  });

  it("laisse la campagne active meme si l objectif est depasse", async () => {
    const result = await fundCampaign.execute({
      campaignId: CampaignId("campaign-1"),
      contributorId: UserId("contributor-1"),
      amount: 800,
    });

    expect(result.status).toBe("active");
    expect(result.status === "active" ? result.collectedAmount : 0).toBe(1100);
  });

  it("refuse le financement d une campagne non active", async () => {
    const inactiveRepository = new InMemoryCampaignRepository([
      {
        id: CampaignId("campaign-2"),
        projectId: ProjectId("project-1"),
        title: "Draft",
        description: "Description",
        goal: 1000,
        endDate: "2026-09-01",
        ownerId: UserId("owner-1"),
        createdAt: "2026-01-01T10:00:00.000Z",
        status: "draft",
      },
    ]);
    const useCase = new FundCampaign(inactiveRepository, contributionRepository, idGenerator, dateGenerator);

    await expect(
      useCase.execute({
        campaignId: CampaignId("campaign-2"),
        contributorId: UserId("contributor-1"),
        amount: 200,
      }),
    ).rejects.toThrow(CampaignNotActiveException);
  });
});

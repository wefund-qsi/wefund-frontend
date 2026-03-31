import { beforeEach, describe, expect, it } from "vitest";
import type { IDateGenerator } from "../../../core/ports/date-generator.interface";
import type { IIdGenerator } from "../../../core/ports/id-generator.interface";
import { ProjectId } from "../../projects/entities/project";
import { UserId } from "../../users/entities/user";
import { InMemoryCampaignRepository } from "../adapters/campaign-repository.in-memory";
import { CreateCampaign } from "./create-campaign";

/**
 * Tests unitaires pour le use-case CreateCampaign
 *
 * Vérifie que les campagnes peuvent être créées en brouillon ou en attente de validation,
 * et que les données sont correctement enregistrées.
 */
describe("CreateCampaign", () => {
    let repository: InMemoryCampaignRepository;
    let createCampaign: CreateCampaign;

    const idGenerator: IIdGenerator = {
        generate: () => "campaign-1",
    };

    const dateGenerator: IDateGenerator = {
        now: () => new Date("2026-02-01T00:00:00.000Z"),
    };

    beforeEach(() => {
        repository = new InMemoryCampaignRepository();
        createCampaign = new CreateCampaign(repository, idGenerator, dateGenerator);
    });

    it("cree une campagne brouillon rattachee a un projet", async () => {
        const campaign = await createCampaign.execute({
            projectId: ProjectId("project-1"),
            ownerId: UserId("user-1"),
            title: "Campagne de lancement",
            description: "Description",
            goal: 2500,
            endDate: "2026-07-01",
        });

        expect(campaign.id).toBe("campaign-1");
        expect(campaign.projectId).toBe("project-1");
        expect(campaign.status).toBe("BROUILLON");
        expect(campaign.goal).toBe(2500);
    });

    it("peut creer une campagne en attente de validation", async () => {
        const campaign = await createCampaign.execute({
            projectId: ProjectId("project-1"),
            ownerId: UserId("user-1"),
            title: "Campagne soumise",
            description: "Description",
            goal: 3000,
            endDate: "2026-07-10",
            status: "EN_ATTENTE",
        });

        expect(campaign.status).toBe("EN_ATTENTE");
    });
});

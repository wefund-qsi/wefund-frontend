import type { IDateGenerator } from "../../../core/ports/date-generator.interface";
import type { IIdGenerator } from "../../../core/ports/id-generator.interface";
import type { Executable } from "../../../shared/executable";
import type { ProjectId } from "../../projects/entities/project";
import { CampaignId, type Campaign, type CampaignFormValues, type DraftCampaign, type PendingCampaign } from "../entites/campaign";
import type { ICampaignRepository } from "../ports/campaign-repository.interface";
import type { UserId } from "../../users/entities/user";

/**
 * Données requises pour créer une nouvelle campagne
 *
 * @typedef {Object} CreateCampaignPayload
 * @property {UserId} ownerId - ID du propriétaire de la campagne
 * @property {ProjectId} projectId - ID du projet associé
 * @property {string} [status="BROUILLON"] - Statut initial (BROUILLON ou EN_ATTENTE)
 */
type CreateCampaignPayload = CampaignFormValues & {
    ownerId: UserId;
    projectId: ProjectId;
    status?: "BROUILLON" | "EN_ATTENTE";
};

/**
 * Use-case pour créer une nouvelle campagne
 *
 * Crée une campagne en brouillon ou en attente d'approbation.
 * Génère automatiquement un ID unique et un timestamp de création.
 */
export class CreateCampaign implements Executable<CreateCampaignPayload, Campaign> {
    private readonly campaignRepository: ICampaignRepository;
    private readonly idGenerator: IIdGenerator;
    private readonly dateGenerator: IDateGenerator;

    constructor(campaignRepository: ICampaignRepository, idGenerator: IIdGenerator, dateGenerator: IDateGenerator) {
        this.campaignRepository = campaignRepository;
        this.idGenerator = idGenerator;
        this.dateGenerator = dateGenerator;
    }

    async execute(data: CreateCampaignPayload): Promise<Campaign> {
        const campaignBase = {
            id: CampaignId(this.idGenerator.generate()),
            projectId: data.projectId,
            title: data.title,
            description: data.description,
            goal: data.goal,
            endDate: data.endDate,
            ownerId: data.ownerId,
            createdAt: this.dateGenerator.now().toISOString(),
        };

        const campaign: DraftCampaign | PendingCampaign = data.status === "EN_ATTENTE"
            ? { ...campaignBase, status: "EN_ATTENTE" }
            : { ...campaignBase, status: "BROUILLON" };

        return this.campaignRepository.create(campaign);
    }
}

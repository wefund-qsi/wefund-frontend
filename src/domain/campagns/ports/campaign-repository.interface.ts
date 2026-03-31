import type { UserId } from "../../users/entities/user";
import type { ProjectId } from "../../projects/entities/project";
import type { Campaign, CampaignId } from "../entites/campaign";

/**
 * Port pour les opérations sur les campagnes
 */
export interface ICampaignRepository {
    /**
     * Récupère toutes les campagnes
     */
    findAll(): Promise<Campaign[]>;

    /**
     * Recherche une campagne par son ID
     */
    findById(id: CampaignId): Promise<Campaign | null>;

    /**
     * Récupère toutes les campagnes d'un projet
     */
    findByProjectId(projectId: ProjectId): Promise<Campaign[]>;

    /**
     * Récupère toutes les campagnes d'un propriétaire
     */
    findByOwnerId(ownerId: UserId): Promise<Campaign[]>;

    /**
     * Crée une nouvelle campagne
     */
    create(campaign: Campaign): Promise<Campaign>;

    /**
     * Met à jour une campagne existante
     */
    update(campaign: Campaign): Promise<Campaign>;

    /**
     * Supprime une campagne par son ID
     */
    delete(id: CampaignId): Promise<boolean>;
}

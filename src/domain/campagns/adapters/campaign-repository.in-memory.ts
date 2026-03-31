import type { UserId } from "../../users/entities/user";
import type { ProjectId } from "../../projects/entities/project";
import type { Campaign, CampaignId } from "../entites/campaign";
import type { ICampaignRepository } from "../ports/campaign-repository.interface";

/**
 * Adaptateur en mémoire pour le dépôt de campagnes
 *
 * Stocke les campagnes en mémoire pour les tests et le développement.
 */
export class InMemoryCampaignRepository implements ICampaignRepository {
    private campaigns: Campaign[];

    /**
     * Constructeur
     * @param campaigns Liste initiale de campagnes
     */
    constructor(campaigns: Campaign[] = []) {
        this.campaigns = campaigns;
    }

    /**
     * Récupère toutes les campagnes
     * @returns Promesse résolue avec la liste de toutes les campagnes
     */
    findAll(): Promise<Campaign[]> {
        return Promise.resolve(this.campaigns);
    }

    /**
     * Recherche une campagne par son ID
     * @param id ID de la campagne
     * @returns Promesse résolue avec la campagne ou null si non trouvée
     */
    findById(id: CampaignId): Promise<Campaign | null> {
        return Promise.resolve(this.campaigns.find((campaign) => campaign.id === id) ?? null);
    }

    /**
     * Récupère toutes les campagnes d'un projet
     * @param projectId ID du projet
     * @returns Promesse résolue avec les campagnes du projet
     */
    findByProjectId(projectId: ProjectId): Promise<Campaign[]> {
        return Promise.resolve(this.campaigns.filter((campaign) => campaign.projectId === projectId));
    }

    /**
     * Récupère toutes les campagnes d'un propriétaire
     * @param ownerId ID du propriétaire
     * @returns Promesse résolue avec les campagnes du propriétaire
     */
    findByOwnerId(ownerId: UserId): Promise<Campaign[]> {
        return Promise.resolve(this.campaigns.filter((campaign) => campaign.ownerId === ownerId));
    }

    /**
     * Crée une nouvelle campagne
     * @param campaign Campagne à créer
     * @returns Promesse résolue avec la campagne créée
     */
    create(campaign: Campaign): Promise<Campaign> {
        this.campaigns.push(campaign);
        return Promise.resolve(campaign);
    }

    /**
     * Met à jour une campagne existante
     * @param campaign Campagne avec les données mises à jour
     * @returns Promesse résolue avec la campagne mise à jour
     */
    update(campaign: Campaign): Promise<Campaign> {
        this.campaigns = this.campaigns.map((currentCampaign) =>
            currentCampaign.id === campaign.id ? campaign : currentCampaign,
        );
        return Promise.resolve(campaign);
    }

    /**
     * Supprime une campagne par son ID
     * @param id ID de la campagne à supprimer
     * @returns Promesse résolue avec true si supprimée, false si non trouvée
     */
    delete(id: CampaignId): Promise<boolean> {
        const campaignExists = this.campaigns.some((campaign) => campaign.id === id);
        if (!campaignExists) {
            return Promise.resolve(false);
        }

        this.campaigns = this.campaigns.filter((campaign) => campaign.id !== id);
        return Promise.resolve(true);
    }
}

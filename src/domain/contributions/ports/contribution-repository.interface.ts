import type { CampaignId } from "../../campagns/entites/campaign";
import type { UserId } from "../../users/entities/user";
import type { Contribution } from "../entities/contribution";
import type { ContributionId } from "../entities/contribution";

/**
 * Port pour les opérations sur les contributions
 */
export interface IContributionRepository {
  /**
   * Crée une nouvelle contribution
   */
  create(contribution: Contribution): Promise<Contribution>;

  /**
   * Met à jour une contribution existante
   */
  update(contribution: Contribution): Promise<Contribution>;

  /**
   * Supprime une contribution par son ID
   */
  delete(id: ContributionId): Promise<boolean>;

  /**
   * Recherche une contribution par son ID
   */
  findById(id: ContributionId): Promise<Contribution | null>;

  /**
   * Récupère toutes les contributions d'une campagne
   */
  findByCampaignId(campaignId: CampaignId): Promise<Contribution[]>;

  /**
   * Récupère toutes les contributions d'un contributeur
   */
  findByContributorId(contributorId: UserId): Promise<Contribution[]>;
}

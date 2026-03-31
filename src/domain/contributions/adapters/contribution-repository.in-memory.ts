import type { CampaignId } from "../../campagns/entites/campaign";
import type { UserId } from "../../users/entities/user";
import type { Contribution, ContributionId } from "../entities/contribution";
import type { IContributionRepository } from "../ports/contribution-repository.interface";

/**
 * Adaptateur en mémoire pour le dépôt de contributions
 *
 * Stocke les contributions en mémoire pour les tests et le développement.
 */
export class InMemoryContributionRepository implements IContributionRepository {
  private contributions: Contribution[];

  /**
   * Constructeur
   * @param contributions Liste initiale de contributions
   */
  constructor(contributions: Contribution[] = []) {
    this.contributions = contributions;
  }

  /**
   * Crée une nouvelle contribution
   * @param contribution Contribution à créer
   * @returns Promesse résolue avec la contribution créée
   */
  create(contribution: Contribution): Promise<Contribution> {
    this.contributions.push(contribution);
    return Promise.resolve(contribution);
  }

  /**
   * Met à jour une contribution existante
   * @param contribution Contribution avec les données mises à jour
   * @returns Promesse résolue avec la contribution mise à jour
   */
  update(contribution: Contribution): Promise<Contribution> {
    this.contributions = this.contributions.map((currentContribution) =>
      currentContribution.id === contribution.id ? contribution : currentContribution,
    );
    return Promise.resolve(contribution);
  }

  /**
   * Supprime une contribution par son ID
   * @param id ID de la contribution à supprimer
   * @returns Promesse résolue avec true si supprimée, false si non trouvée
   */
  delete(id: ContributionId): Promise<boolean> {
    const contributionExists = this.contributions.some((contribution) => contribution.id === id);

    if (!contributionExists) {
      return Promise.resolve(false);
    }

    this.contributions = this.contributions.filter((contribution) => contribution.id !== id);
    return Promise.resolve(true);
  }

  /**
   * Recherche une contribution par son ID
   * @param id ID de la contribution
   * @returns Promesse résolue avec la contribution ou null si non trouvée
   */
  findById(id: ContributionId): Promise<Contribution | null> {
    return Promise.resolve(this.contributions.find((contribution) => contribution.id === id) ?? null);
  }

  /**
   * Récupère toutes les contributions d'une campagne
   * @param campaignId ID de la campagne
   * @returns Promesse résolue avec les contributions de la campagne
   */
  findByCampaignId(campaignId: CampaignId): Promise<Contribution[]> {
    return Promise.resolve(this.contributions.filter((contribution) => contribution.campaignId === campaignId));
  }

  /**
   * Récupère toutes les contributions d'un contributeur
   * @param contributorId ID du contributeur
   * @returns Promesse résolue avec les contributions du contributeur
   */
  findByContributorId(contributorId: UserId): Promise<Contribution[]> {
    return Promise.resolve(this.contributions.filter((contribution) => contribution.contributorId === contributorId));
  }
}

import type { Executable } from "../../../shared/executable";
import type { UserId } from "../../users/entities/user";
import type { Contribution } from "../entities/contribution";
import type { IContributionRepository } from "../ports/contribution-repository.interface";

/**
    * Use-case pour afficher les contributions d'un utilisateur.
    *
    * Ce use-case récupère toutes les contributions associées à l'identifiant de l'utilisateur donné.
    */
export class ViewUserContributions implements Executable<UserId, Contribution[]> {
  private readonly contributionRepository: IContributionRepository;

/**
    * @param contributionRepository - Le repository pour accéder aux contributions
    *
    * Ce constructeur initialise le repository nécessaire pour exécuter le use-case d'affichage des contributions d'un utilisateur.
    */
  constructor(contributionRepository: IContributionRepository) {
    this.contributionRepository = contributionRepository;
  }

  execute(contributorId: UserId): Promise<Contribution[]> {
    return this.contributionRepository.findByContributorId(contributorId);
  }
}

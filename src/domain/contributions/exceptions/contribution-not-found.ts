/**
 * Exception levée quand une contribution n'est pas trouvée
 *
 * Utilisée lorsqu'on tente d'accéder à une contribution qui n'existe pas dans le système.
 */
export class ContributionNotFoundException extends Error {
  /**
   * Constructeur de l'exception
   */
  constructor() {
    super("Contribution not found.");
    this.name = "ContributionNotFoundException";
  }
}

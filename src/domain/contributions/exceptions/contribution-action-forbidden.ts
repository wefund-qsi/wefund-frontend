/**
 * Exception levée quand une action interdite est tentée sur une contribution
 *
 * Utilisée lorsqu'on tente de modifier ou rembourser une contribution
 * alors que la campagne n'est pas active.
 */
export class ContributionActionForbiddenException extends Error {
  /**
   * Constructeur de l'exception
   */
  constructor() {
    super("This contribution can only be modified or refunded while the campaign is active.");
    this.name = "ContributionActionForbiddenException";
  }
}


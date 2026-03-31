/**
 * Exception levée quand on tente de contribuer à une campagne inactive
 *
 * Utilisée lorsqu'un utilisateur tente de financer une campagne qui n'est pas en statut ACTIVE.
 */
export class CampaignNotActiveException extends Error {
  /**
   * Constructeur de l'exception
   */
  constructor() {
    super("Only active campaigns can be funded.");
    this.name = "CampaignNotActiveException";
  }
}

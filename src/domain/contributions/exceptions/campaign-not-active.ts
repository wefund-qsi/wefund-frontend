export class CampaignNotActiveException extends Error {
  constructor() {
    super("Only active campaigns can be funded.");
    this.name = "CampaignNotActiveException";
  }
}

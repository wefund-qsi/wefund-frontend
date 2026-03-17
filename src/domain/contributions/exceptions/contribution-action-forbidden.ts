export class ContributionActionForbiddenException extends Error {
  constructor() {
    super("This contribution can only be modified or refunded while the campaign is active.");
    this.name = "ContributionActionForbiddenException";
  }
}

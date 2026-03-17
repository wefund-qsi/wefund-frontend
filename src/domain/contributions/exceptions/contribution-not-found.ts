export class ContributionNotFoundException extends Error {
  constructor() {
    super("Contribution not found.");
    this.name = "ContributionNotFoundException";
  }
}

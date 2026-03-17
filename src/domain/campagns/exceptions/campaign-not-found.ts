import type { CampaignId } from "../entites/campaign";

export class CampaignNotFoundException extends Error {
    constructor(id: CampaignId) {
        super(`Campaign with id "${id}" was not found.`);
        this.name = "CampaignNotFoundException";
    }
}

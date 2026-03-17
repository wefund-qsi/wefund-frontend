import type { UserId } from "../../users/entities/user";
import type { ProjectId } from "../../projects/entities/project";
import type { Campaign, CampaignId } from "../entites/campaign";
import type { ICampaignRepository } from "../ports/campaign-repository.interface";

export class InMemoryCampaignRepository implements ICampaignRepository {
    private campaigns: Campaign[];

    constructor(campaigns: Campaign[] = []) {
        this.campaigns = campaigns;
    }

    findAll(): Promise<Campaign[]> {
        return Promise.resolve(this.campaigns);
    }

    findById(id: CampaignId): Promise<Campaign | null> {
        return Promise.resolve(this.campaigns.find((campaign) => campaign.id === id) ?? null);
    }

    findByProjectId(projectId: ProjectId): Promise<Campaign[]> {
        return Promise.resolve(this.campaigns.filter((campaign) => campaign.projectId === projectId));
    }

    findByOwnerId(ownerId: UserId): Promise<Campaign[]> {
        return Promise.resolve(this.campaigns.filter((campaign) => campaign.ownerId === ownerId));
    }

    create(campaign: Campaign): Promise<Campaign> {
        this.campaigns.push(campaign);
        return Promise.resolve(campaign);
    }

    update(campaign: Campaign): Promise<Campaign> {
        this.campaigns = this.campaigns.map((currentCampaign) =>
            currentCampaign.id === campaign.id ? campaign : currentCampaign,
        );
        return Promise.resolve(campaign);
    }

    delete(id: CampaignId): Promise<boolean> {
        const campaignExists = this.campaigns.some((campaign) => campaign.id === id);
        if (!campaignExists) {
            return Promise.resolve(false);
        }

        this.campaigns = this.campaigns.filter((campaign) => campaign.id !== id);
        return Promise.resolve(true);
    }
}

import type { UserId } from "../../users/entities/user";
import type { ProjectId } from "../../projects/entities/project";
import type { Campaign, CampaignId } from "../entites/campaign";

export interface ICampaignRepository {
    findAll(): Promise<Campaign[]>;
    findById(id: CampaignId): Promise<Campaign | null>;
    findByProjectId(projectId: ProjectId): Promise<Campaign[]>;
    findByOwnerId(ownerId: UserId): Promise<Campaign[]>;
    create(campaign: Campaign): Promise<Campaign>;
    update(campaign: Campaign): Promise<Campaign>;
    delete(id: CampaignId): Promise<boolean>;
}

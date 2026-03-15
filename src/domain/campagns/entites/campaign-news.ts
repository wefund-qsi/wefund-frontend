import type { Brand } from "../../../shared/utils";
import type { CampaignId } from "./campaign";

export type NewsId = Brand<string, "NewsId">;
export const NewsId = (value: string): NewsId => value as NewsId;

export type CampaignNews = {
  id: NewsId;
  campaignId: CampaignId;
  title: string;
  content: string;
  publishedAt: Date;
};

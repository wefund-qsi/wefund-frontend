import { z } from "zod";
import type { Brand } from "../../../shared/utils";
import type { ProjectId } from "../../projects/entities/project";
import type { UserId } from "../../users/entities/user";

// --- Enum Statut Campagne ---

export enum StatutCampagne {
  BROUILLON = 'BROUILLON',
  EN_ATTENTE = 'EN_ATTENTE',
  ACTIVE = 'ACTIVE',
  REUSSIE = 'REUSSIE',
  ECHOUEE = 'ECHOUEE',
  REFUSEE = 'REFUSEE'
}

// --- Branded Type CampaignId ---

export type CampaignId = Brand<string, "CampaignId">;
export const CampaignId = (value: string): CampaignId => value as CampaignId;

// --- Discriminated Union pour le statut (cardinalité = 6, pas infini) ---

export type CampaignStatus =
  | 'BROUILLON'
  | 'EN_ATTENTE'
  | 'ACTIVE'
  | 'REUSSIE'
  | 'ECHOUEE'
  | 'REFUSEE';

// --- Types métier avec discriminated union par statut ---

interface CampaignBase {
  id: CampaignId;
  projectId: ProjectId;
  title: string;
  description: string;
  goal: number;
  endDate: string;
  ownerId: UserId;
  createdAt: string;
}

export interface DraftCampaign extends CampaignBase {
  status: "draft";
}

export interface PendingCampaign extends CampaignBase {
  status: "pending_validation";
}

export interface ActiveCampaign extends CampaignBase {
  status: "active";
  startedAt: string;
  collectedAmount: number;
}

export interface SucceededCampaign extends CampaignBase {
  status: "succeeded";
  startedAt: string;
  completedAt: string;
  collectedAmount: number;
}

export interface FailedCampaign extends CampaignBase {
  status: "failed";
  startedAt: string;
  completedAt: string;
  collectedAmount: number;
}

export interface RejectedCampaign extends CampaignBase {
  status: "rejected";
}

export type Campaign =
  | DraftCampaign
  | PendingCampaign
  | ActiveCampaign
  | SucceededCampaign
  | FailedCampaign
  | RejectedCampaign;

export function getCampaignCollectedAmount(campaign: Campaign): number {
  if (
    campaign.status === "active" ||
    campaign.status === "succeeded" ||
    campaign.status === "failed"
  ) {
    return campaign.collectedAmount;
  }

  return 0;
}

export function getCampaignProgress(campaign: Campaign): number {
  const collectedAmount = getCampaignCollectedAmount(campaign);
  return Math.round((collectedAmount / campaign.goal) * 100);
}

export function getCampaignProgressForBar(campaign: Campaign): number {
  return Math.min(100, getCampaignProgress(campaign));
}

// --- Schéma Zod (uniquement ce que l'utilisateur saisit) ---

export const campaignSchema = z.object({
  title: z.string().min(1, "campaignForm.errors.titleRequired"),
  description: z.string().min(1, "campaignForm.errors.descriptionRequired"),
  goal: z.number().positive("campaignForm.errors.goalPositive"),
  endDate: z.string().min(1, "campaignForm.errors.endDateRequired"),
});

export type CampaignFormValues = z.infer<typeof campaignSchema>;

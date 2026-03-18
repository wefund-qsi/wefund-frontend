import { z } from "zod";
import type { Brand } from "../../../shared/utils";
import type { ProjectId } from "../../projects/entities/project";
import type { UserId } from "../../users/entities/user";

// --- Enum Statut Campagne ---

export const StatutCampagne = {
  BROUILLON: 'BROUILLON',
  EN_ATTENTE: 'EN_ATTENTE',
  ACTIVE: 'ACTIVE',
  REUSSIE: 'REUSSIE',
  ECHOUEE: 'ECHOUEE',
  REFUSEE: 'REFUSEE'
} as const;

export type StatutCampagneType = typeof StatutCampagne[keyof typeof StatutCampagne];

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
  status: 'BROUILLON';
}

export interface PendingCampaign extends CampaignBase {
  status: 'EN_ATTENTE';
}

export interface ActiveCampaign extends CampaignBase {
  status: 'ACTIVE';
  startedAt: string;
  collectedAmount: number;
}

export interface SucceededCampaign extends CampaignBase {
  status: 'REUSSIE';
  startedAt: string;
  completedAt: string;
  collectedAmount: number;
}

export interface FailedCampaign extends CampaignBase {
  status: 'ECHOUEE';
  startedAt: string;
  completedAt: string;
  collectedAmount: number;
}

export interface RejectedCampaign extends CampaignBase {
  status: 'REFUSEE';
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
    campaign.status === 'ACTIVE' ||
    campaign.status === 'REUSSIE' ||
    campaign.status === 'ECHOUEE'
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

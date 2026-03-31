/**
 * Entités et schémas pour les campagnes de financement
 *
 * Ce module définit les types, les statuts et les utilitaires pour les campagnes.
 * Les campagnes utilisent une union discriminée basée sur le statut pour assurer
 * la cohérence des propriétés selon leur état actuel.
 *
 * @module domain/campagns/entites/campaign
 */

import { z } from "zod";
import type { Brand } from "../../../shared/utils";
import type { ProjectId } from "../../projects/entities/project";
import type { UserId } from "../../users/entities/user";

// --- Enum Statut Campagne ---

/**
 * Énumération des statuts possibles d'une campagne
 */
export const StatutCampagne = {
  BROUILLON: 'BROUILLON',
  EN_ATTENTE: 'EN_ATTENTE',
  ACTIVE: 'ACTIVE',
  REUSSIE: 'REUSSIE',
  ECHOUEE: 'ECHOUEE',
  REFUSEE: 'REFUSEE'
} as const;

/**
 * Type pour les valeurs de StatutCampagne
 */
export type StatutCampagneType = typeof StatutCampagne[keyof typeof StatutCampagne];

// --- Branded Type CampaignId ---

/**
 * Identifiant unique d'une campagne
 */
export type CampaignId = Brand<string, "CampaignId">;
export const CampaignId = (value: string): CampaignId => value as CampaignId;

// --- Discriminated Union pour le statut (cardinalité = 6, pas infini) ---

/**
 * Type union de tous les statuts possibles d'une campagne
 */
export type CampaignStatus =
  | 'BROUILLON'
  | 'EN_ATTENTE'
  | 'ACTIVE'
  | 'REUSSIE'
  | 'ECHOUEE'
  | 'REFUSEE';

// --- Types métier avec discriminated union par statut ---

/**
 * Propriétés communes à toutes les campagnes
 */
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

/**
 * Campagne en brouillon (non encore soumise)
 */
export interface DraftCampaign extends CampaignBase {
  status: 'BROUILLON';
}

/**
 * Campagne en attente d'approbation
 */
export interface PendingCampaign extends CampaignBase {
  status: 'EN_ATTENTE';
}

/**
 * Campagne active en cours de financement
 */
export interface ActiveCampaign extends CampaignBase {
  status: 'ACTIVE';
  startedAt: string;
  collectedAmount: number;
}

/**
 * Campagne qui a atteint son objectif
 */
export interface SucceededCampaign extends CampaignBase {
  status: 'REUSSIE';
  startedAt: string;
  completedAt: string;
  collectedAmount: number;
}

/**
 * Campagne qui n'a pas atteint son objectif
 */
export interface FailedCampaign extends CampaignBase {
  status: 'ECHOUEE';
  startedAt: string;
  completedAt: string;
  collectedAmount: number;
}

/**
 * Campagne refusée par la plateforme
 */
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

/**
 * Récupère le montant collecté d'une campagne
 *
 * Retourne le montant collecté si la campagne est active, réussie ou échouée.
 * Sinon, retourne 0.
 *
 * @param {Campaign} campaign - La campagne
 * @returns {number} Le montant collecté
 */
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

/**
 * Calcule le pourcentage de progression d'une campagne
 *
 * @param {Campaign} campaign - La campagne
 * @returns {number} Pourcentage de progression (0-∞)
 */
export function getCampaignProgress(campaign: Campaign): number {
  const collectedAmount = getCampaignCollectedAmount(campaign);
  return Math.round((collectedAmount / campaign.goal) * 100);
}

/**
 * Calcule le pourcentage de progression pour la barre visuelle
 *
 * Limite à 100% pour l'affichage UI.
 *
 * @param {Campaign} campaign - La campagne
 * @returns {number} Pourcentage de progression (0-100)
 */
export function getCampaignProgressForBar(campaign: Campaign): number {
  return Math.min(100, getCampaignProgress(campaign));
}

// --- Schéma Zod (uniquement ce que l'utilisateur saisit) ---

/**
 * Schéma de validation pour les données de formulaire de campagne
 */
export const campaignSchema = z.object({
  title: z.string().min(1, "campaignForm.errors.titleRequired"),
  description: z.string().min(1, "campaignForm.errors.descriptionRequired"),
  goal: z.number().positive("campaignForm.errors.goalPositive"),
  endDate: z.string().min(1, "campaignForm.errors.endDateRequired"),
});

/**
 * Type des valeurs du formulaire de campagne
 */
export type CampaignFormValues = z.infer<typeof campaignSchema>;

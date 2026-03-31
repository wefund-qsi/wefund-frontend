/**
 * Entités pour les contributions de financement
 *
 * Ce module définit les types pour les contributions des utilisateurs aux campagnes.
 * Une contribution représente un versement financier d'un contributeur vers une campagne.
 *
 * @module domain/contributions/entities/contribution
 */

import type { Brand } from "../../../shared/utils";
import type { CampaignId } from "../../campagns/entites/campaign";
import type { UserId } from "../../users/entities/user";

/**
 * Identifiant unique d'une contribution
 */
export type ContributionId = Brand<string, "ContributionId">;
export const ContributionId = (value: string): ContributionId => value as ContributionId;

/**
 * Contribution d'un utilisateur à une campagne
 *
 * @typedef {Object} Contribution
 * @property {ContributionId} id - Identifiant unique de la contribution
 * @property {CampaignId} campaignId - ID de la campagne financée
 * @property {UserId} contributorId - ID de l'utilisateur qui contribue
 * @property {number} amount - Montant versé en euros
 * @property {string} createdAt - Date et heure de création (format ISO 8601)
 */
export type Contribution = {
  id: ContributionId;
  campaignId: CampaignId;
  contributorId: UserId;
  amount: number;
  createdAt: string;
};


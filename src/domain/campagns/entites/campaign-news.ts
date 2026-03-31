/**
 * Entités pour les actualités de campagne
 *
 * Ce module définit les types pour les actualités publiées sur les campagnes.
 * Les actualités permettent aux propriétaires de campagne de communiquer des mises à jour
 * aux contributeurs pendant la durée de la campagne.
 *
 * @module domain/campagns/entites/campaign-news
 */

import type { Brand } from "../../../shared/utils";
import type { CampaignId } from "./campaign";

/**
 * Identifiant unique d'une actualité
 */
export type NewsId = Brand<string, "NewsId">;
export const NewsId = (value: string): NewsId => value as NewsId;

/**
 * Actualité associée à une campagne
 *
 * Contient une mise à jour ou un message publié par le propriétaire de la campagne
 * pour informer les contributeurs de l'avancement du projet.
 *
 * @typedef {Object} CampaignNews
 * @property {NewsId} id - Identifiant unique de l'actualité
 * @property {CampaignId} campaignId - Identifiant de la campagne associée
 * @property {string} title - Titre de l'actualité
 * @property {string} content - Contenu détaillé de l'actualité
 * @property {Date} publishedAt - Date et heure de publication
 */
export type CampaignNews = {
  id: NewsId;
  campaignId: CampaignId;
  title: string;
  content: string;
  publishedAt: Date;
};



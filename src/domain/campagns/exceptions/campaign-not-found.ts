import type { CampaignId } from "../entites/campaign";

/**
 * Exception levée quand une campagne n'est pas trouvée
 *
 * Utilisée lorsqu'on tente d'accéder à une campagne qui n'existe pas dans le système.
 */
export class CampaignNotFoundException extends Error {
    /**
     * Constructeur de l'exception
     *
     * @param {CampaignId} id - L'ID de la campagne qui n'a pas été trouvée
     */
    constructor(id: CampaignId) {
        super(`Campaign with id "${id}" was not found.`);
        this.name = "CampaignNotFoundException";
    }
}

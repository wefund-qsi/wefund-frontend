/**
 * Adaptateur pour la génération de dates réelles
 *
 * Ce module fournit une implémentation concrète du générateur de dates
 * qui retourne la date et l'heure actuelles du système.
 *
 * @module core/adapters/real-date-generator
 */

import type { IDateGenerator } from "../ports/date-generator.interface";

/**
 * Classe responsable de la génération de dates réelles
 *
 * Cette classe implémente l'interface IDateGenerator et fournit
 * la date/heure actuelle du système. Elle est utilisée en production
 * pour obtenir des timestamps réels, contrairement aux tests qui peuvent
 * utiliser des dates mockées.
 *
 * @implements {IDateGenerator}
 *
 * @example
 * ```typescript
 * const dateGenerator = new RealDateGenerator();
 * const currentDate = dateGenerator.now(); // Retourne la date/heure actuelle
 * ```
 */
export class RealDateGenerator implements IDateGenerator {
    /**
     * Retourne la date et l'heure actuelles du système
     *
     * @returns {Date} Un objet Date représentant le moment présent
     */
    now(): Date {
        return new Date();
    }
}
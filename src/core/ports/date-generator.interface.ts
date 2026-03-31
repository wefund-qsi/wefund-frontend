/**
 * Interface pour la génération de dates
 *
 * Ce module définit le contrat que tout générateur de dates doit respecter.
 * Cette interface fait partie du pattern des ports (abstraction) de l'architecture
 * en couches hexagonale. Elle permet de découpler le code métier de l'implémentation
 * concrète de la génération de dates.
 *
 * @module core/ports/date-generator.interface
 */

/**
 * Contrat pour les générateurs de dates
 *
 * Cette interface définit une méthode unique pour obtenir la date et l'heure actuelle.
 * Les implémentations concrètes peuvent fournir des dates réelles ou mockées (utile pour les tests).
 *
 * Utilité :
 * - En production : Retourne la date/heure système réelle via {@link RealDateGenerator}
 * - En tests : Permet de retourner des dates fixées pour tester le comportement du système
 *   de manière déterministe et reproductible
 *
 * @interface IDateGenerator
 *
 * @example
 * ```typescript
 * // Implémentation de test avec une date fixée
 * class MockDateGenerator implements IDateGenerator {
 *     constructor(private fixedDate: Date) {}
 *     now(): Date {
 *         return this.fixedDate;
 *     }
 * }
 *
 * // Utilisation
 * const dateGen = new MockDateGenerator(new Date('2026-01-01'));
 * console.log(dateGen.now()); // Toujours 2026-01-01
 * ```
 */
export interface IDateGenerator {
    /**
     * Retourne la date et l'heure actuelle
     *
     * @returns {Date} Un objet Date représentant le moment courant.
     *                 En production, cela retourne la date/heure système.
     *                 En tests, cela peut retourner une date fixée.
     */
    now(): Date;
}
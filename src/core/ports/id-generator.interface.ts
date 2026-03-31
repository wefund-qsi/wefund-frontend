/**
 * Interface pour la génération d'identifiants uniques
 *
 * Ce module définit le contrat que tout générateur d'identifiants doit respecter.
 * Cette interface fait partie du pattern des ports (abstraction) de l'architecture
 * en couches hexagonale. Elle permet de découpler le code métier de l'implémentation
 * concrète de la génération d'identifiants.
 *
 * @module core/ports/id-generator.interface
 */

/**
 * Contrat pour les générateurs d'identifiants uniques
 *
 * Cette interface définit une méthode unique pour générer des identifiants uniques.
 * Les implémentations concrètes peuvent fournir des identifiants réels (UUID v4) ou
 * mockés (utile pour les tests).
 * 
 * Utilité :
 * - En production : Génère des UUID v4 cryptographiquement sécurisés via {@link RealIdGenerator}
 * - En tests : Permet de générer des identifiants prévisibles et contrôlés pour tester
 *   le comportement du système de manière déterministe et reproductible
 *
 * @interface IIdGenerator
 *
 * @example
 * ```typescript
 * // Implémentation de test avec des IDs prévisibles
 * class MockIdGenerator implements IIdGenerator {
 *     private counter = 0;
 *     generate(): string {
 *         return `mock-id-${++this.counter}`;
 *     }
 * }
 *
 * // Utilisation
 * const idGen = new MockIdGenerator();
 * console.log(idGen.generate()); // "mock-id-1"
 * console.log(idGen.generate()); // "mock-id-2"
 * ```
 */
export interface IIdGenerator {
    /**
     * Génère un identifiant unique
     *
     * @returns {string} Un identifiant unique au format string.
     *                   En production, cela retourne un UUID v4 (ex: "550e8400-e29b-41d4-a716-446655440000").
     *                   En tests, cela peut retourner un identifiant prévisible.
     */
    generate(): string;
}
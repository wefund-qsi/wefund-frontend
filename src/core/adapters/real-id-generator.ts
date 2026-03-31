/**
 * Adaptateur pour la génération d'identifiants uniques réels
 *
 * Ce module fournit une implémentation concrète du générateur d'identifiants
 * qui génère des UUID v4 cryptographiquement sécurisés.
 *
 * @module core/adapters/real-id-generator
 */

import type { IIdGenerator } from "../ports/id-generator.interface";

/**
 * Classe responsable de la génération d'identifiants uniques réels
 *
 * Cette classe implémente l'interface IIdGenerator et fournit
 * des identifiants uniques basés sur le standard UUID v4. Elle utilise
 * l'API cryptographique native du navigateur pour générer des UUIDs
 * cryptographiquement sécurisés. Elle est utilisée en production
 * pour générer des identifiants uniques pour les entités du système,
 * contrairement aux tests qui peuvent utiliser des IDs mockés.
 *
 * @implements {IIdGenerator}
 *
 * @example
 * ```typescript
 * const idGenerator = new RealIdGenerator();
 * const uniqueId = idGenerator.generate(); // Retourne un UUID v4 unique
 * // Exemple de résultat: "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export class RealIdGenerator implements IIdGenerator {
    /**
     * Génère un identifiant unique cryptographiquement sécurisé
     *
     * Utilise l'API Web Crypto native pour générer un UUID v4 aléatoire.
     * Chaque appel génère un nouvel identifiant unique garantissant
     * l'absence de collision dans le système.
     *
     * @returns {string} Un identifiant unique au format UUID v4
     *
     * @throws {Error} Si l'API crypto n'est pas disponible (rare)
     */
    generate(): string {
        return crypto.randomUUID();
    }
}
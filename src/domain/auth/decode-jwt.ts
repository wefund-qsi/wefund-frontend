import type { JwtPayload } from "./entities/auth";

/**
 * Décode un token JWT et extrait son contenu (payload)
 *
 * @param {string} token - Token JWT au format "header.payload.signature"
 * @returns {JwtPayload} Objet contenant les données du token (sub, username, role, etc.)
 * @throws {Error} Si le format du token est invalide
 *
 * @example
 * ```typescript
 * const token = "fake-header.eyJzdWIiOiIxMjM0In0=.fake-signature";
 * const payload = decodeJwt(token);
 * console.log(payload.username); // Accès aux données du token
 * ```
 */
export function decodeJwt(token: string): JwtPayload {
    const parts = token.split(".");
    if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
    }
    
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64)) as JwtPayload;
}
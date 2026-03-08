// --- Utilitaire générique Brand ---
export type Brand<T, B extends string> = T & { readonly __brand: B };

// --- Result ---
// Modélise un traitement qui peut réussir (Ok) ou échouer (Err).
// L'erreur est dans le type de retour, pas dans un throw.

export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const Err = <E>(error: E): Result<never, E> => ({ ok: false, error });

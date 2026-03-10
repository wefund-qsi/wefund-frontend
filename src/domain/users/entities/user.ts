import type { Brand } from "../../../shared/utils";

// --- Branded Type UserId ---

export type UserId = Brand<string, "UserId">;
export const UserId = (value: string): UserId => value as UserId;

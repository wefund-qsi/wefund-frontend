import { z } from "zod";
import type { Brand } from "./utils";
import type { UserId } from "./user";

// --- Branded Type ProjectId ---

export type ProjectId = Brand<string, "ProjectId">;
export const ProjectId = (value: string): ProjectId => value as ProjectId;

// --- Type métier ---

export interface Project {
  id: ProjectId;
  title: string;
  description: string;
  photoUrl: string;
  ownerId: UserId;
  createdAt: string;
}

// --- Schéma Zod ---

export const projectSchema = z.object({
  title: z.string().min(1, "projectForm.errors.titleRequired"),
  description: z.string().min(1, "projectForm.errors.descriptionRequired"),
  photoUrl: z.string().min(1, "projectForm.errors.photoUrlRequired").url("projectForm.errors.photoUrlInvalid"),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

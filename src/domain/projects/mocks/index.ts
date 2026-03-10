import type { Project } from "./project";
import projectMockData from "../mocks/projectMock.json";

export const mockProject: Project = {
  ...projectMockData,
  ownerId: projectMockData.ownerId as any,
  id: projectMockData.id as any,
};

export const projectMocks = {
  default: mockProject,
};


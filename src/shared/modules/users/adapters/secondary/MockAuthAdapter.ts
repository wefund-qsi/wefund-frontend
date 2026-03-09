import type { IAuthPort, LoginRequest, SignupRequest, LoginResult, SignupResult, ApiErrorResult } from "../../ports/AuthPort";
import type { Result } from "../../../../../types/utils";
import { Ok, Err } from "../../../../../types/utils";
import type { UserRole } from "../../entities/User";

// Simule un délai réseau
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

type MockUser = {
  id: string;
  prenom: string;
  nom: string;
  username: string;
  password: string;
  role: UserRole;
};

const INITIAL_USERS: readonly MockUser[] = [
  {
    id: "mock-user-1",
    prenom: "Alice",
    nom: "Duval",
    username: "alice",
    password: "secret",
    role: "VISITEUR",
  },
];

export const createMockAuthAdapter = (): IAuthPort => {
  const mockUsers: MockUser[] = INITIAL_USERS.map((u) => ({ ...u }));
  let nextId = 2;

  return {
    login: async (request: LoginRequest): Promise<Result<LoginResult, ApiErrorResult>> => {
      await delay(300);

      const user = mockUsers.find(
        (u) => u.username === request.username && u.password === request.password
      );

      if (!user) {
        return Err<ApiErrorResult>({
          statusCode: 401,
          message: "Identifiants invalides",
          error: "Unauthorized",
        });
      }

      return Ok<LoginResult>({
        statusCode: 200,
        message: "Login successful",
        data: {
          access_token: `mock-jwt-token-for-${user.username}-${Date.now()}`,
        },
        timestamp: new Date().toISOString(),
      });
    },

    signup: async (request: SignupRequest): Promise<Result<SignupResult, ApiErrorResult>> => {
      await delay(300);

      const exists = mockUsers.find((u) => u.username === request.username);

      if (exists) {
        return Err<ApiErrorResult>({
          statusCode: 409,
          message: "Ce nom d'utilisateur est déjà pris",
          error: "Conflict",
        });
      }

      const newUser: MockUser = {
        id: `mock-user-${nextId++}`,
        prenom: request.prenom,
        nom: request.nom,
        username: request.username,
        password: request.password,
        role: request.role,
      };

      mockUsers.push(newUser);

      return Ok<SignupResult>({
        statusCode: 201,
        message: "User, auth and role created successfully",
        data: {
          id: newUser.id,
          nom: newUser.nom,
          prenom: newUser.prenom,
          username: newUser.username,
          role: newUser.role,
        },
        timestamp: new Date().toISOString(),
      });
    },
  };
};

import type { Result } from "../../../../types/utils";
import type { UserRole } from "../entities/User";

export interface LoginRequest {
  readonly username: string;
  readonly password: string;
}

export interface SignupRequest {
  readonly prenom: string;
  readonly nom: string;
  readonly username: string;
  readonly password: string;
  readonly role: UserRole;
}

export interface LoginSuccessData {
  readonly access_token: string;
}

export interface SignupSuccessData {
  readonly id: string;
  readonly nom: string;
  readonly prenom: string;
  readonly username: string;
  readonly role: UserRole;
}

export interface ApiSuccessResult<T> {
  readonly statusCode: number;
  readonly message: string;
  readonly data: T;
  readonly timestamp: string;
}

export interface ApiErrorResult {
  readonly statusCode: number;
  readonly message: string;
  readonly error: string;
}

export type LoginResult = ApiSuccessResult<LoginSuccessData>;
export type SignupResult = ApiSuccessResult<SignupSuccessData>;

export interface IAuthPort {
  login(request: LoginRequest): Promise<Result<LoginResult, ApiErrorResult>>;
  signup(request: SignupRequest): Promise<Result<SignupResult, ApiErrorResult>>;
}
import type { IAuthPort, LoginRequest, LoginResult, ApiErrorResult } from "../ports/AuthPort";
import type { Result } from "../../../../types/utils";

export interface ILoginUseCase {
  execute(request: LoginRequest): Promise<Result<LoginResult, ApiErrorResult>>;
}

export const createLoginUseCase = (authPort: IAuthPort): ILoginUseCase => ({
  execute: (request: LoginRequest) => authPort.login(request),
});
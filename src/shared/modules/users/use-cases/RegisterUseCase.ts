import type { IAuthPort, SignupRequest, SignupResult, ApiErrorResult } from "../ports/AuthPort";
import type { Result } from "../../../../types/utils";
import { DEFAULT_ROLE } from "../entities/User";

export interface IRegisterUseCase {
  execute(
    request: Omit<SignupRequest, "role">
  ): Promise<Result<SignupResult, ApiErrorResult>>;
}

export const createRegisterUseCase = (authPort: IAuthPort): IRegisterUseCase => ({
  execute: (request: Omit<SignupRequest, "role">) =>
    authPort.signup({ ...request, role: DEFAULT_ROLE }),
});
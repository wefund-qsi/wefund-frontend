import type { IIdGenerator } from "../ports/id-generator.interface";

export class RealIdGenerator implements IIdGenerator {
    generate(): string {
        return crypto.randomUUID();
    }
}
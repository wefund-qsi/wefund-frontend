import type { IDateGenerator } from "../ports/date-generator.interface";

export class RealDateGenerator implements IDateGenerator {
    now(): Date {
        return new Date();
    }
}
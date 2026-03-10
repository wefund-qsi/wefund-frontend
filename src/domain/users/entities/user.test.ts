import { UserId } from "./user";

describe("UserId", () => {
  it("crée un UserId à partir d'une string", () => {
    const id = UserId("user-456");
    expect(id).toBe("user-456");
  });
});
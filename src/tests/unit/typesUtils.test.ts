import { Ok, Err } from "../../types/utils";
import { ProjectId } from "../../types/project";
import { UserId } from "../../types/user";

describe("Branded Types", () => {
  describe("ProjectId", () => {
    it("crée un ProjectId à partir d'une string", () => {
      const id = ProjectId("abc-123");
      expect(id).toBe("abc-123");
    });
  });

  describe("UserId", () => {
    it("crée un UserId à partir d'une string", () => {
      const id = UserId("user-456");
      expect(id).toBe("user-456");
    });
  });
});

describe("Result", () => {
  describe("Ok", () => {
    it("crée un Result success", () => {
      const result = Ok(42);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(42);
      }
    });
  });

  describe("Err", () => {
    it("crée un Result erreur", () => {
      const result = Err("something went wrong");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("something went wrong");
      }
    });
  });

  it("permet le pattern matching via discriminant ok", () => {
    const success = Ok("data");
    const failure = Err("oops");

    const handleResult = (r: typeof success | typeof failure): string => {
      if (r.ok) return `Success: ${r.value}`;
      return `Error: ${r.error}`;
    };

    expect(handleResult(success)).toBe("Success: data");
    expect(handleResult(failure)).toBe("Error: oops");
  });
});

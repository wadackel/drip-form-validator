import assert from "power-assert";
import Validator from "../src/";

describe("Export", () => {
  it("Should be module export", () => {
    assert(Validator);
  });
});

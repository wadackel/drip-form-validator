import assert from "power-assert";
import Validator from "../src/";

describe("index", () => {
  it("Should be module export", () => {
    assert(Validator);
  });
});

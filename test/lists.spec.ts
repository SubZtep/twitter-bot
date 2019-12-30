import { expect } from "chai"
import { retweet } from "../src/lists"

describe("Read lists", () => {
  it("Retweet", () => {
    const words = retweet()
    expect(Array.isArray(words)).to.be.true
  })
})

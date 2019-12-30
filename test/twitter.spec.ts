import { expect } from "chai"
import { search } from "../src/twitter"
process.env.CACHE_DIR = "./test/cache"

describe("Twitter Search (no mock)", () => {
  it("Without params", async () => {
    const tweets = await search([], [])
    expect(tweets.length).greaterThan(0)
  })
})

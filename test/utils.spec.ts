import { expect } from "chai"
import * as util from "../src/utils"

describe("toFollow", () => {
  const followers = ["1", "2"]
  const following = ["1"]
  it("Find to follow", () => {
    expect(util.toFollow(followers, following)).to.deep.equal(["2"])
  })
  it("Nothing to do", () => {
    following.push("2")
    expect(util.toFollow(followers, following)).to.be.an("array").that.is.empty
  })
})

describe("toUnfollow", () => {
  const followers = ["1", "2"]
  const following = ["1"]
  it("Nothing to do", () => {
    expect(util.toUnfollow(followers, following)).to.be.an("array").that.is
      .empty
  })
  it("Find to unfollow", () => {
    following.push("2", "3", "4")
    expect(util.toUnfollow(followers, following)).to.deep.equal(["3", "4"])
  })
})

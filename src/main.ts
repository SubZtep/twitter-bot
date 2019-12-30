import { retweet, blacklist } from "./lists"
import * as twitter from "./twitter"
import * as util from "./utils"
import { config } from "dotenv"
config()

const main = async () => {
  console.log("Start", new Date())

  const tweets = await twitter.search(retweet(), blacklist())
  tweets.forEach(tweet => {
    console.log("Retweet", tweet.id_str)
    //twitter.retweet(tweet.id_str)
  })

  const followers = await twitter.followers(process.env.SCREEN_NAME as string)
  const following = await twitter.following(process.env.SCREEN_NAME as string)

  util.toFollow(followers, following).forEach(async id => {
    console.log("Follow", id)
    // try {
    //   await twitter.follow(id)
    // } catch (err) {
    //   console.log(`Follow error (User ID: ${id})`, err.message)
    // }
  })

  util.toUnfollow(followers, following).forEach(async id => {
    console.log("Unfollow", id)
    // try {
    //   await twitter.unfollow(id)
    // } catch (err) {
    //   console.log(`Unfollow error (User ID: ${id})`, err.message)
    // }
  })
}

main()

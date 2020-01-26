import { retweet, blacklist } from "./lists"
import * as twitter from "./twitter"
import flatCache from "flat-cache"
import * as util from "./utils"
import { config } from "dotenv"
config()

const main = async () => {
  console.log("Start", new Date())
  const cache = flatCache.load("search", process.env.CACHE_DIR)

  const since = cache.getKey("since")
  console.log("SINCE", typeof since)
  cache.setKey("since", "123")
  cache.save()

  // const followers = await twitter.followers(process.env.SCREEN_NAME as string)
  // const following = await twitter.following(process.env.SCREEN_NAME as string)
  // const tweets = await twitter.search(retweet(), blacklist())

  // tweets.forEach(tweet => {
  //   if (followers.includes(tweet.user.id_str)) {
  //     twitter.retweet(tweet.id_str)
  //   }
  // })

  // //
  // //
  // //

  // const followers = await twitter.followers("SubZtep")
  // console.log(followers)

  // await twitter.follow("19888096").catch(err => console.error(err.message))
  // await twitter
  //   .follow("19888096")
  //   .catch(err => console.log("Follow error:", err.message))
  // await twitter
  //   .unfollow("19888096")
  //   .catch(err => console.log("Unfollow error:", err.message))

  // const followers = await twitter.followers(process.env.SCREEN_NAME as string)
  // const following = await twitter.following(process.env.SCREEN_NAME as string)

  // await twitter
  //   .retweet("1206565634412285952")
  //   .catch(err => console.log("Error:", err.message))

  // const tweets = await twitter.search(retweet(), blacklist())
  // tweets.forEach(tweet => {
  //   console.log("Retweet", tweet.id_str)
  //   //twitter.retweet(tweet.id_str)
  // })

  // util.toFollow(followers, following).forEach(async id => {
  //   console.log("Follow", id)
  //   // try {
  //   //   await twitter.follow(id)
  //   // } catch (err) {
  //   //   console.log(`Follow error (User ID: ${id})`, err.message)
  //   // }
  // })

  // util.toUnfollow(followers, following).forEach(async id => {
  //   console.log("Unfollow", id)
  //   // try {
  //   //   await twitter.unfollow(id)
  //   // } catch (err) {
  //   //   console.log(`Unfollow error (User ID: ${id})`, err.message)
  //   // }
  // })
}

main()

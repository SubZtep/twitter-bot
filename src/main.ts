import { retweet, blacklist } from "./lists"
import * as twitter from "./twitter"
import flatCache from "flat-cache"
import * as util from "./utils"
import { config } from "dotenv"
config()

const main = async () => {
  console.log("Start", new Date())
  const cache = flatCache.load("search", process.env.CACHE_DIR)

  const followers = await twitter.followers(process.env.SCREEN_NAME as string)
  const following = await twitter.following(process.env.SCREEN_NAME as string)
  const tweets = await twitter.search(
    retweet(),
    blacklist(),
    cache.getKey("since_id")
  )
  if (tweets.length) {
    cache.setKey("since_id", tweets[0].id_str)
    cache.save()
  }

  tweets.forEach(tweet => {
    if (followers.includes(tweet.user.id_str)) {
      console.log(`Retweet ${tweet.id_str}`)
      twitter.retweet(tweet.id_str)
    }
  })

  util.toFollow(followers, following).forEach(id => {
    console.log(`Follow ${id}`)
    twitter.follow(id)
  })

  util.toUnfollow(followers, following).forEach(id => {
    console.log(`Unfollow ${id}`)
    twitter.unfollow(id)
  })
}

main()

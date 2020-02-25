import ora from "ora"
import Twit from "twit"
import chalk from "chalk"
import { config } from "dotenv"
import flatCache from "flat-cache"
import * as util from "./utils"
import * as twitter from "./twitter"
import { retweet, blacklist } from "./lists"
config()

const main = async () => {
  // console.log(await twitter.rateLimit())
  // for (let i = 100; i < 300; i++) twitter.tweet(`Tweet xx number ${i}`)

  console.log("Start", chalk.yellow(util.fdate()))
  const cache = flatCache.load("search", process.env.CACHE_DIR)

  let spinner = ora("Retrieve followers").start()
  const followers: string[] = await twitter
    .followers(process.env.SCREEN_NAME as string)
    .then(res => {
      spinner.succeed()
      return res
    })
    .catch(err => {
      spinner.fail()
      console.log(chalk.red(err.message))
      return []
    })

  spinner = ora("Retrieve following list").start()
  const following: string[] = await twitter
    .following(process.env.SCREEN_NAME as string)
    .then(res => {
      spinner.succeed()
      return res
    })
    .catch(err => {
      spinner.fail()
      console.log(chalk.red(err.message))
      return []
    })

  spinner = ora("Search for tweets to retweet").start()
  const tweets: Twit.Twitter.Status[] = await twitter
    .search(retweet(), blacklist(), cache.getKey("since_id"))
    .then(res => {
      spinner[res.length > 0 ? "succeed" : "warn"]()
      return res
    })
    .catch(err => {
      spinner.fail()
      console.log(chalk.red(err.message))
      return []
    })

  let rateLimitExceeded = false
  for (const tweet of tweets) {
    if (followers.includes(tweet.user.id_str)) {
      const link = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
      spinner = ora(`Retweet ${chalk.blue(link)}`)

      await twitter
        .retweet(tweet.id_str)
        .then(() => {
          spinner.succeed()
          cache.setKey("since_id", tweets[0].id_str)
          cache.save()
        })
        .catch(err => {
          console.log(chalk.red(err.message))
          spinner.fail()
          if (err.code === twitter.ERROR_CODE.OVER_UPDATE_LIMIT) {
            rateLimitExceeded = true
          }
        })

      if (rateLimitExceeded) {
        break
      }
      console.log("no rate limit")
    }
  }

  console.log("moved forward")

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

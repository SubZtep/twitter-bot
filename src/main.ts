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
  console.log(chalk.grey(util.fdate()))
  const cache = flatCache.load("search", process.env.CACHE_DIR)
  const error = chalk.red.bold

  let spinner = ora("Retrieve followers").start()
  const followers: string[] = await twitter
    .followers(process.env.SCREEN_NAME as string)
    .then(res => {
      spinner.succeed()
      return res
    })
    .catch(err => {
      spinner.fail()
      console.log(error(err.message))
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
      console.log(error(err.message))
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
      console.log(error(err.message))
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
          cache.setKey("since_id", tweets[0].id_str)
          cache.save()
          spinner.succeed()
        })
        .catch(err => {
          console.log(error(err.message))
          spinner.fail()
          if (err.code === twitter.ERROR_CODE.OVER_UPDATE_LIMIT) {
            rateLimitExceeded = true
          }
        })

      if (rateLimitExceeded) {
        break
      }
    }
  }

  util.toFollow(followers, following).forEach(async id => {
    spinner = ora(`Follow ${chalk.call(id)}`).start()
    await twitter
      .follow(id)
      .then(() => spinner.succeed())
      .catch(err => {
        spinner.fail()
        console.log(error(err.message))
      })
  })

  util.toUnfollow(followers, following).forEach(async id => {
    spinner = ora(`Unfollow ${chalk.call(id)}`).start()
    await twitter
      .unfollow(id)
      .then(() => spinner.succeed())
      .catch(err => {
        spinner.fail()
        console.log(error(err.message))
      })
  })

  console.log(chalk.grey(util.fdate()) + "\n―\n")
}

main()

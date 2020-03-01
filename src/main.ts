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
    .catch(err => {
      spinner.fail()
      console.log(error(err.message))
      return []
    })
  if (spinner.isSpinning) {
    spinner.succeed()
  }

  spinner = ora("Retrieve following list").start()
  const following: string[] = await twitter
    .following(process.env.SCREEN_NAME as string)
    .catch(err => {
      spinner.fail()
      console.log(error(err.message))
      return []
    })
  if (spinner.isSpinning) {
    spinner.succeed()
  }

  spinner = ora("Search for tweets to retweet").start()
  const tweets: Twit.Twitter.Status[] = await twitter
    .search(retweet(), blacklist(), cache.getKey("since_id"))
    .catch(err => {
      spinner.fail()
      console.log(error(err.message))
      return []
    })
  if (spinner.isSpinning) {
    spinner[tweets.length > 0 ? "succeed" : "info"]()
  }

  for (const tweet of tweets) {
    if (followers.includes(tweet.user.id_str)) {
      const link = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
      spinner = ora(`Retweet ${chalk.blue(link)}`)
      try {
        await twitter.retweet(tweet.id_str)
        cache.setKey("since_id", tweets[0].id_str)
        cache.save()
        spinner.succeed()
      } catch (err) {
        console.log(error(err.message))
        spinner.fail()
        if (err.code === twitter.ERROR_CODE.OVER_UPDATE_LIMIT) {
          break
        }
      }
    }
  }

  for (const id of util.toFollow(followers, following)) {
    const link = `https://twitter.com/i/user/${id}`
    spinner = ora(`Follow ${chalk.blue(link)}`).start()
    await twitter.follow(id).catch(err => {
      spinner.fail()
      console.log(error(err.message))
    })
    if (spinner.isSpinning) {
      spinner.succeed()
    }
  }

  for (const id of util.toUnfollow(followers, following)) {
    const link = `https://twitter.com/i/user/${id}`
    spinner = ora(`Unfollow ${chalk.blue(link)}`).start()
    await twitter.unfollow(id).catch(err => {
      spinner.fail()
      console.log(error(err.message))
    })
    if (spinner.isSpinning) {
      spinner.succeed()
    }
  }

  console.log(chalk.grey(util.fdate()) + `\n`)
}
;(() => {
  const intMin = parseInt(process.env.JOB_INTERVAL_MIN as string, 10)
  console.log(
    "Job interval:",
    chalk.cyan(`every ${intMin} min${intMin > 1 ? "s" : ""}`)
  )
  console.log(
    "Twitter handle:",
    chalk.cyan((process.env.SCREEN_NAME as string) + `\n`)
  )

  setInterval(main, intMin * 60 * 1000)
  main()
})()

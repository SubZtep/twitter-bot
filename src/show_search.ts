import { retweet, blacklist } from "./lists"
import { search } from "./twitter"
import chalk from "chalk"
import ora from "ora"

const main = async () => {
  const spinner = ora("Retrieve Tweets").start()
  const tweets = await search(retweet(), blacklist())
  spinner.succeed()

  tweets.forEach(tweet => {
    const link = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
    console.log(`${tweet.text}\n${chalk.blue(link)}\n`)
  })
}

main()

import { retweet, blacklist } from "./lists"
import { search } from "./twitter"

const main = async () => {
  const tweets = await search(retweet(), blacklist())
  tweets.forEach(tweet =>
    console.log(
      `${tweet.text}\n> https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}\n`
    )
  )
}

main()

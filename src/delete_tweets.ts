import { config } from "dotenv"
import { T, deleteTweet, timeline } from "./twitter"
config()

// const screen_name = "FINEINDIEFINDS"
// const since_id = "1232357956051783680"

const main = async () => {

  T.get("statuses/user_timeline", {
    screen_name,
    since_id,
    count: 200
  }, (err, res) => {
    if (err) {
      console.log("Timeline Error", err)
      return
    }

    for (const tweet of (res as string[])) {
      if ((tweet.text as string).startsWith("Tweet")) {
        console.log(tweet.id_str, tweet.text)
        deleteTweet(tweet.id_str)
          .catch(err => console.log("Delete error", err))
      }
    }
  }
}

main()

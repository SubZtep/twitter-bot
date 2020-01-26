import Twit from "twit"
import { config } from "dotenv"
config()

const T = new Twit({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET_KEY,
  access_token: process.env.API_ACCESS_TOKEN,
  access_token_secret: process.env.API_ACCESS_TOKEN_SECRET
} as Twit.Options)

/**
 * Perform a safe keyword search in English
 * @param keywords List of search words
 * @param blacklist List of ignored search words
 * @param since_id Returns results with an ID greater than specified
 */
export const search = (
  keywords: string[],
  blacklist: string[],
  since_id?: string
): Promise<Twit.Twitter.Status[]> => {
  return new Promise((resolve, reject) => {
    // Search descrition:
    // https://developer.twitter.com/en/docs/tweets/search/guides/standard-operators
    const q =
      keywords.join(" OR ") +
      " filter:safe " +
      blacklist.map(word => `-${word}`)
    if (q.length > 500) {
      reject("Search string is more than 500 characters.")
    }

    const searchParams: Twit.Params = {
      q,
      result_type: "recent",
      count: 100,
      lang: "en",
      include_entities: false,
      exclude_replies: true,
      include_user_entities: false,
      since_id
    }

    T.get("search/tweets", searchParams, (err, res) => {
      if (err) {
        reject(err)
      }
      // @ts-ignore: Property 'statuses' does not exist on type 'object'.
      const tweets = res?.statuses as Twit.Twitter.Status[]
      if (!tweets) {
        reject("Invalid response")
      }
      resolve(tweets)
    })
  })
}

/**
 * Get followers
 * @param user Twitter user handle
 */
export const followers = (user: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    T.get(
      "followers/ids",
      {
        screen_name: user,
        stringify_ids: true
      },
      (err, res) => {
        if (err) {
          reject(err)
        }
        // @ts-ignore
        const ids = res?.ids as string[]
        if (!ids) {
          reject("Invalid response")
        }
        resolve(ids)
      }
    )
  })
}

/**
 * Get followed users
 * @param user Twitter user handle
 */
export const following = (user: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    T.get(
      "friends/ids",
      {
        screen_name: user,
        stringify_ids: true
      },
      (err, res) => {
        if (err) {
          reject(err)
        }
        // @ts-ignore
        const ids = res?.ids as string[]
        if (!ids) {
          reject("Invalid response")
        }
        resolve(ids)
      }
    )
  })
}

/**
 * Retweet a tweet
 * @param id Tweet ID
 */
export const retweet = (id: string) => {
  return new Promise((resolve, reject) => {
    T.post("statuses/retweet/:id", { id }, (err, data, response) => {
      if (err) {
        reject(err)
      }
      // console.log("Retweet", [data, response])
      resolve()
    })
  })
}

/**
 * Follow specified user
 */
export const follow = (id: string) => {
  return new Promise((resolve, reject) => {
    T.post("friendships/create", { user_id: id }, err => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

/**
 * Unfollow specified user
 */
export const unfollow = (id: string) => {
  return new Promise((resolve, reject) => {
    T.post("friendships/destroy", { user_id: id }, err => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

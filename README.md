# Twitter Bot

This bot helps to automatize a Twitter account follows and retweets.

## Workflow

1. Retrieve followed/follower users.
2. Search for tweets.
3. Confirm the found tweet is from a follower.
4. Retweet.
5. Follow who is following.
6. Unfollow who is not following.

## How to Setup

1. Make sure you have **NodeJS** installed. Open a terminal and enter `node -v`. If unsuccessful, [download](https://nodejs.org/en/) and install it.
2. Go to [Twitter Developer](https://developer.twitter.com/en/apps) page, authenticate, and create an app for API keys.
3. Uncompress or clone from GIT the project.
4. Run `npm install` to make all the dependencies available.
5. Create a copy from `.env.example` to `.env` where environment variables stored. Populate `API_KEY`, `API_SECRET_KEY`, `API_ACCESS_TOKEN` and `API_ACCESS_TOKEN_SECRET` with generated values from the developer page. `SCREEN_NAME` is your Twitter handle. `JOB_INTERVAL_MIN` is running interval.
6. On Linux or Mac environment make `/cache` folder writable.
7. Open `retweet.txt` and populate with words or expressions which tempted to be followed. Every new word supposed to be in a new line. Enter multiple words in the same row for search for the exact word pairs.
8. Open `blacklist.txt` which contains the phrases to ignore with the same rules above.

After finishing these steps the bot is ready to use.

## Bot Commands

- `npm run show`

  Display current search results. This command doesn't use cache and tented to use for tweak `retweet.txt` and `blacklist.txt`.

- `npm run bot`

  Start the workflow. This command supposed to run automatized.

## Cache

Last search id cached only to prevent process a tweet multiple times.
(May consider caching follower/unfollower list due rate limit.)

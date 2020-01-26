# Twitter Bot

## How to create API keys

1. Go to https://developer.twitter.com/en/apps
2. Click on create app
   - If you don't have developer account Apply

## Setup

- Populate `retweet.txt` and `blacklist.txt` with words or expressions, entry per line
- Copy `.env.example` to `.env` and fill missing details
- Make `/cache` folder writable
- Create API keys https://developer.twitter.com

## Commands

- `$ npm run show` - Display current search results
- `$ npm run bot` - Start the workflow

## Workflow

1. Retreive followed/follower users
2. Search for tweets
3. Confirm the found tweet is from a follower
4. Retweet
5. Follow who is following
6. Unfollow who is not following

## Cache

Last search id cached only to prevent process a tweet multiple times.
May consider caching follower/unfollower list due rate limit.

---

https://help.twitter.com/en/rules-and-policies/twitter-automation

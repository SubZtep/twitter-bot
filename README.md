# Twitter Bot

## How to create API keys

1. Go to https://developer.twitter.com/en/apps
2. Click on create app
   - If you don't have developer account Apply
     **TBC**

## Setup

- Populate `retweet.txt` with expressions, entry per line
- Populate `blacklist.txt` with expressions, entry per line
- Copy `.env.example` to `.env` and fill missing details
- Make `/cache` folder writable
- Create API keys https://developer.twitter.com

## Commands

- `$ npm run show` - Display current search results
- `$ npm run bot` - Start the workflow

## Workflow

1. Search for tweets
2. Retweet
3. Retreive followed/follower users
4. Follow who is following
5. Unfollow who is not following

---

https://help.twitter.com/en/rules-and-policies/twitter-automation

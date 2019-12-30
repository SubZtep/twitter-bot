import fs from "fs"
import path from "path"
import { config } from "dotenv"
config()

/**
 * Get word list to search for retweet
 */
export const retweet = (): string[] =>
  fs
    .readFileSync(path.resolve(__dirname, "../retweet.txt"))
    .toString("utf8")
    .split("\n")
    .filter(Boolean)
    .map(word => (word.includes(" ") ? `"${word}"` : word))

/**
 * Get word list to search for retweet
 */
export const blacklist = (): string[] =>
  fs
    .readFileSync(path.resolve(__dirname, "../blacklist.txt"))
    .toString("utf8")
    .split("\n")
    .filter(Boolean)
    .map(word => (word.includes(" ") ? `"${word}"` : word))

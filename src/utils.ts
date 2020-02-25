/**
 * Users who follow but not followed
 */
export const toFollow = (followers: string[], following: string[]): string[] =>
  followers.filter(id => !following.includes(id))

/**
 * Users who not follow but followed
 */
export const toUnfollow = (
  followers: string[],
  following: string[]
): string[] => following.filter(id => !followers.includes(id))

/**
 * Current formatted date and time
 */
export const fdate = () =>
  new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false
  }).format()

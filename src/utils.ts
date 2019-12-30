/**
 * Return users who follow but not followed
 */
export const toFollow = (followers: string[], following: string[]): string[] =>
  followers.filter(id => !following.includes(id))

/**
 * Return users who not follow but followed
 */
export const toUnfollow = (
  followers: string[],
  following: string[]
): string[] => following.filter(id => !followers.includes(id))

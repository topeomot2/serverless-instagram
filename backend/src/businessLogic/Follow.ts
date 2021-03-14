import FollowStore from "../dataLayer/FollowStore"
import UserStatsStore from "../dataLayer/UserStatsStore"
import { FollowItem } from "../models/FollowItem"
import { UserStatsItem } from "../models/UserStatsItem"
import { FollowUserRequest } from "../requests/FollowUserRequest"
import { UnFollowUserRequest } from "../requests/UnFollowRequest"

const FOLLOWS = 'follows'
const FOLLOWERS = 'followers'
const followStore = new FollowStore()
const userStatsStore = new UserStatsStore()

export async function follow(followRequest: FollowUserRequest, userId: string) {
    const createdAt = new Date().toISOString()
    await followStore.add({
      userId,
      followedId: followRequest.userId,
      createdAt
    })

    // update stats for both the user following and the followed user
    // This can be update to work with SQS
    await Promise.all([
        userStatsStore.increase(FOLLOWS, 1, userId),
        userStatsStore.increase(FOLLOWERS, 1, followRequest.userId)
    ])
    return
}

export async function unFollow(unFollowRequest: UnFollowUserRequest, userId: string) {
    const item = await followStore.delete( userId,unFollowRequest.userId)

    // update stats for both the user following and the followed user
    // This can be update to work with SQS
    await Promise.all([
        userStatsStore.decrease(FOLLOWS, 1, userId),
        userStatsStore.decrease(FOLLOWERS, 1, unFollowRequest.userId)
    ])
    return
}

export async function getUserFollowers(userId: string): Promise<FollowItem[]> {
    return await followStore.getFollowers(userId)
}

export async function getUsersFollowed(userId: string): Promise<FollowItem[]> {
    return await followStore.getFollowed(userId)
}
import FollowStore from "../dataLayer/FollowStore"
import UserStatsStore from "../dataLayer/UserStatsStore"
import { FollowItem } from "../models/FollowItem"
import { FollowUserRequest } from "../requests/FollowUserRequest"
import { UnFollowUserRequest } from "../requests/UnFollowRequest"

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
    await Promise.all([
        userStatsStore.increaseFollows(userId, 1),
        userStatsStore.increaseFollows(followRequest.userId, 1)
    ])
    return
}

export async function unFollow(unFollowRequest: UnFollowUserRequest, userId: string) {
    await followStore.delete( userId,unFollowRequest.userId)

    // update stats for both the user following and the followed user
    await Promise.all([
        userStatsStore.decreaseFollows(userId, 1),
        userStatsStore.decreaseFollows(unFollowRequest.userId, 1)
    ])
    return
}

export async function getUserFollowers(userId: string): Promise<FollowItem[]> {
    return await followStore.getFollowers(userId)
}

export async function getUsersFollowed(userId: string): Promise<FollowItem[]> {
    return await followStore.getFollowed(userId)
}

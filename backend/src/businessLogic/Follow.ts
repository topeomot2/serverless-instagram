import FollowStore from "../dataLayer/FollowStore"
import { FollowItem } from "../models/FollowItem"
import { FollowUserRequest } from "../requests/FollowUserRequest"
import { UnFollowUserRequest } from "../requests/UnFollowRequest"

const followStore = new FollowStore()

export async function follow(followRequest: FollowUserRequest, userId: string) {
    const createdAt = new Date().toISOString()
    await followStore.add({
      userId,
      followedId: followRequest.userId,
      createdAt
    })

    return
}

export async function unFollow(unFollowRequest: UnFollowUserRequest, userId: string) {
    const item = await followStore.delete( userId,unFollowRequest.userId)
    return
}

export async function getUserFollowers(userId: string): Promise<FollowItem[]> {
    return await followStore.getFollowers(userId)
}

export async function getUsersFollowed(userId: string): Promise<FollowItem[]> {
    return await followStore.getFollowed(userId)
}
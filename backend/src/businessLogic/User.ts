import UserStatsStore from "../dataLayer/UserStatsStore"
import { UserStatsItem } from "../models/UserStatsItem"

const userStatsStore = new UserStatsStore()

export async function getUserStats(userId: string): Promise<UserStatsItem> {
    return await userStatsStore.get(userId)
}
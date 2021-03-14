import * as uuid from 'uuid'
import PhotoStore from "../dataLayer/PhotoStore"
import UserStatsStore from "../dataLayer/UserStatsStore"
import { PhotoItem } from "../models/PhotoItem"
import { CreatePhotoRequest } from "../requests/CreatePhotoRequest"
import { UpdatePhotoRequest } from "../requests/UpdatPhotoRequest"

const LIKES = 'likes'
const VIEWS = 'views'
const photoStore = new PhotoStore()
const userStatsStore = new UserStatsStore()

export async function createPhoto(newPhoto: CreatePhotoRequest, userId: string) {
    const createdAt = new Date().toISOString()
    const item = await photoStore.add({
      userId,
      ...newPhoto,
      createdAt,
      updatedAt: createdAt,
      likes: 0,
      views: 0
    })

    return item
}


export async function getPresignedUrl() {
    const photoId = uuid.v4()
    const photoUrl = photoStore.generatePhotoUrl(photoId)
    const preSignedUrl = photoStore.getPhotoPresignedUrl(photoId)
    return {
        preSignedUrl,
        photoUrl,
        photoId
    }
}

export async function updatePhoto(updatedPhoto: UpdatePhotoRequest, photoId: string, userId: string): Promise<void> {
    return await photoStore.update(photoId, userId, updatedPhoto)
}

export async function getPhoto(photoId: string): Promise<PhotoItem> {
    return await photoStore.get(photoId)
}

export async function getUserPhotos(userId: string): Promise<PhotoItem[]> {
    return await photoStore.getUserPhotos(userId)
}

export async function likePhoto(photoId: string, userId: string): Promise<void> {
    // update stats of user and photo
    // This can be update to work with SQS
    await Promise.all([
        photoStore.increase(LIKES, 1, photoId),
        userStatsStore.increase(LIKES, 1, userId)
    ])
    return
}

export async function viewPhoto(photoId: string, userId: string): Promise<void> {
    // update stats of user and photo
    // This can be update to work with SQS
    await Promise.all([
        photoStore.increase(VIEWS, 1, photoId),
        userStatsStore.increase(VIEWS, 1, userId)
    ])
    return
}
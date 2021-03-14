import * as uuid from 'uuid'
import PhotoStore from "../dataLayer/PhotoStore"
import { PhotoItem } from "../models/PhotoItem"
import { CreatePhotoRequest } from "../requests/CreatePhotoRequest"
import { UpdatePhotoRequest } from "../requests/UpdatPhotoRequest"

const photoStore = new PhotoStore()

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
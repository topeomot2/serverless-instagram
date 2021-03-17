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
    const photoUrl = photoStore.generatePhotoUrl(newPhoto.photoId)
    const item = await photoStore.add({
      userId,
      ...newPhoto,
      photoUrl,
      createdAt,
      updatedAt: createdAt,
      likes: 0,
      views: 0
    })

    return item
}


export async function getPresignedUrl() {
    const photoId = uuid.v4()
    const preSignedUrl = photoStore.getPhotoPresignedUrl(photoId)
    return {
        preSignedUrl,
        photoId
    }
}

export async function updatePhoto(updatedPhoto: UpdatePhotoRequest, photoId: string, userId: string): Promise<void> {
    const photoItem = await photoStore.getUserPhoto(photoId, userId)
    if(photoItem) {
        return await photoStore.update(photoId, updatedPhoto)
    }
    return
    
}

export async function getPhoto(photoId: string): Promise<PhotoItem> {
    return await photoStore.get(photoId)
}

export async function getUserPhotos(userId: string): Promise<PhotoItem[]> {
    return await photoStore.getUserPhotos(userId)
}

export async function getPhotos(): Promise<PhotoItem[]> {
    return await photoStore.getPhotos()
}

export async function likePhoto(photoId: string, userId: string) {
    // update stats of user and photo
    return await  Promise.all([
        photoStore.increaseLikes(photoId),
        userStatsStore.increase(LIKES, 1, userId)
     ])
}

export async function viewPhoto(photoId: string, userId: string) {
    // update stats of user and photo
   return await  Promise.all([
       photoStore.increaseViews(photoId),
       userStatsStore.increase(VIEWS, 1, userId)
    ])

}
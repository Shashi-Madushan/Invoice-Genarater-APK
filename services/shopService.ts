import { db } from '@/firebaseConfig'
import { ShopDetails } from "@/types/invoice"
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'

export async function addShop(userId: string, shop: ShopDetails) {
  try {
    const docRef = await addDoc(collection(db, 'users', userId, 'shops'), shop)
    return docRef.id
  } catch (err) {
    console.error('Error adding shop:', err)
    throw err
  }
}

export async function getShops(userId: string) {
  try {
    const shopsCol = collection(db, 'users', userId, 'shops')
    const snapshot = await getDocs(shopsCol)
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
  } catch (err) {
    console.error('Error fetching shops:', err)
    throw err
  }
}

export async function updateShop(userId: string, shopId: string, data: Partial<ShopDetails>) {
  try {
    const shopRef = doc(db, 'users', userId, 'shops', shopId)
    await updateDoc(shopRef, data)
    return shopId
  } catch (err) {
    console.error('Error updating shop:', err)
    throw err
  }
}

export async function deleteShop(userId: string, shopId: string) {
  try {
    const shopRef = doc(db, 'users', userId, 'shops', shopId)
    await deleteDoc(shopRef)
    return shopId
  } catch (err) {
    console.error('Error deleting shop:', err)
    throw err
  }
}
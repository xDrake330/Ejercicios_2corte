import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { Item, CreateItemData, UpdateItemData } from '../types/firestore'

const COLLECTION_NAME = 'items'

// Función auxiliar para convertir documentos de Firestore a objetos Item
const convertFirestoreDocToItem = (doc: QueryDocumentSnapshot<DocumentData>): Item => {
  const data = doc.data()
  return {
    id: doc.id,
    nombre: data.nombre,
    descripcion: data.descripcion || '',
    completado: data.completado || false,
    fechaCreacion: data.fechaCreacion?.toDate() || new Date(),
    fechaActualizacion: data.fechaActualizacion?.toDate() || new Date(),
    usuarioId: data.usuarioId
  }
}

// Crear un nuevo item
export const createItem = async (itemData: CreateItemData, userId: string): Promise<Item> => {
  try {
    const now = serverTimestamp()
    const newItemData = {
      ...itemData,
      completado: itemData.completado || false,
      fechaCreacion: now,
      fechaActualizacion: now,
      usuarioId: userId
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), newItemData)
    
    // Obtener el documento creado para devolverlo con el ID
    const createdItem: Item = {
      id: docRef.id,
      nombre: itemData.nombre,
      descripcion: itemData.descripcion || '',
      completado: itemData.completado || false,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      usuarioId: userId
    }

    return createdItem
  } catch (error: any) {
    console.error('Error al crear item:', error)
    throw new Error(`Error al crear item: ${error.message}`)
  }
}

// Leer todos los items de un usuario
export const getItems = async (userId: string): Promise<Item[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('usuarioId', '==', userId),
      orderBy('fechaCreacion', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const items: Item[] = []
    
    querySnapshot.forEach((doc) => {
      items.push(convertFirestoreDocToItem(doc))
    })
    
    return items
  } catch (error: any) {
    console.error('Error al obtener items:', error)
    throw new Error(`Error al obtener items: ${error.message}`)
  }
}

// Actualizar un item
export const updateItem = async (itemId: string, updateData: UpdateItemData): Promise<Item> => {
  try {
    const itemRef = doc(db, COLLECTION_NAME, itemId)
    
    const updatePayload = {
      ...updateData,
      fechaActualizacion: serverTimestamp()
    }
    
    await updateDoc(itemRef, updatePayload)
    
    // Para devolver el item actualizado, necesitaríamos hacer una consulta adicional
    // Por simplicidad, devolvemos un objeto con los datos actualizados
    const updatedItem: Item = {
      id: itemId,
      nombre: updateData.nombre || '',
      descripcion: updateData.descripcion || '',
      completado: updateData.completado || false,
      fechaCreacion: new Date(), // Estos valores se actualizarán en el store
      fechaActualizacion: new Date(),
      usuarioId: '' // Se actualizará en el store
    }
    
    return updatedItem
  } catch (error: any) {
    console.error('Error al actualizar item:', error)
    throw new Error(`Error al actualizar item: ${error.message}`)
  }
}

// Eliminar un item
export const deleteItem = async (itemId: string): Promise<void> => {
  try {
    const itemRef = doc(db, COLLECTION_NAME, itemId)
    await deleteDoc(itemRef)
  } catch (error: any) {
    console.error('Error al eliminar item:', error)
    throw new Error(`Error al eliminar item: ${error.message}`)
  }
}

// Obtener un item específico por ID
export const getItemById = async (itemId: string): Promise<Item | null> => {
  try {
    const q = query(collection(db, COLLECTION_NAME))
    const querySnapshot = await getDocs(q)
    
    for (const doc of querySnapshot.docs) {
      if (doc.id === itemId) {
        return convertFirestoreDocToItem(doc)
      }
    }
    
    return null
  } catch (error: any) {
    console.error('Error al obtener item por ID:', error)
    throw new Error(`Error al obtener item: ${error.message}`)
  }
}

import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, firebaseReady } from '../firebase/config'
import { useDispatch } from 'react-redux'
import { setUserFromFirebase } from '../store/slices/authSlice'

export default function AuthListener() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!firebaseReady || !auth) return
    const unsub = onAuthStateChanged(auth, (user) => {
      dispatch(setUserFromFirebase(user))
    })
    return () => unsub && unsub()
  }, [dispatch])

  return null
}
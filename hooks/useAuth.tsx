'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          id: uid,
          email: data.email,
          displayName: data.displayName,
          plan: data.plan || 'free',
          stripeCustomerId: data.stripeCustomerId || null,
          projectsUsedThisMonth: data.projectsUsedThisMonth || 0,
          billingCycleReset: data.billingCycleReset?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
        }
      }
      return null
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  // Create user document in Firestore
  const createUserDocument = async (firebaseUser: FirebaseUser, displayName: string) => {
    const userRef = doc(db, 'users', firebaseUser.uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      const billingCycleReset = new Date()
      billingCycleReset.setMonth(billingCycleReset.getMonth() + 1)

      await setDoc(userRef, {
        email: firebaseUser.email,
        displayName: displayName || firebaseUser.displayName || 'User',
        plan: 'free',
        stripeCustomerId: null,
        projectsUsedThisMonth: 0,
        billingCycleReset: billingCycleReset,
        createdAt: serverTimestamp(),
      })
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName })
      await createUserDocument(result.user, displayName)
    } catch (error: any) {
      console.error('Sign up error:', error)
      throw new Error(error.message)
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      console.error('Sign in error:', error)
      throw new Error(error.message)
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      await createUserDocument(result.user, result.user.displayName || 'User')
    } catch (error: any) {
      console.error('Google sign in error:', error)
      throw new Error(error.message)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setFirebaseUser(null)
    } catch (error: any) {
      console.error('Sign out error:', error)
      throw new Error(error.message)
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    if (firebaseUser) {
      const userData = await fetchUserData(firebaseUser.uid)
      setUser(userData)
    }
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)

      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser.uid)
        setUser(userData)
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = {
    user,
    firebaseUser,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

"use client"

import { useEffect, useState } from "react"
import { router } from "expo-router"
import { useAuth } from "@/contexts/AuthContext"
import SplashScreen from "@/components/screens/SplashScreen"

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth()
  const [splashCompleted, setSplashCompleted] = useState(false)

  // Handle splash screen timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashCompleted(true)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  // Handle navigation after splash and auth are both ready
  useEffect(() => {
    if (splashCompleted && !isLoading) {
      if (isAuthenticated) {
        // User is already authenticated, go to home screen
        router.replace("/(app)/home")
      } else {
        // User is not authenticated, go to signup
        router.replace("/(auth)/signup")
      }
    }
  }, [splashCompleted, isLoading, isAuthenticated])

  return <SplashScreen />
} 


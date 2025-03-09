"use client"

import { useEffect, useState } from "react"
import { router } from "expo-router"
import { useAuth } from "@/contexts/AuthContext"
import SplashScreen from "@/components/screens/SplashScreen"
import { getUserData } from "@/utils/deviceId"

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth()
  const [splashCompleted, setSplashCompleted] = useState(false)

  // Only handle navigation after splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashCompleted(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Handle navigation after splash screen
  useEffect(() => {
    if (!splashCompleted || isLoading) return

    const navigate = async () => {
      try {
        const userData = await getUserData()
        if (userData) {
          router.replace("/(auth)/auth")
        } else {
          router.replace("/(auth)/signup")
        }
      } catch (error) {
        console.error("Navigation error:", error)
        router.replace("/(auth)/signup")
      }
    }

    navigate()
  }, [splashCompleted, isLoading])

  return <SplashScreen />
} 


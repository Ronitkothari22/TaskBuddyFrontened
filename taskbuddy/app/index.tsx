"use client"

import { useEffect } from "react"
import { router } from "expo-router"
import SplashScreen from "@/components/screens/SplashScreen"

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/signup")
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return <SplashScreen />
}


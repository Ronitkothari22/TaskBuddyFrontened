"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import * as LocalAuthentication from "expo-local-authentication"
import { Fingerprint, Key } from "lucide-react-native"
import { COLORS } from "../../constants/theme"
import { useAuth } from "@/contexts/AuthContext"

export default function AuthScreen() {
  const { authenticate, isLoading } = useAuth()
  const [authError, setAuthError] = useState("")
  const pulseAnim = new Animated.Value(1)

  useEffect(() => { 
    // Start the pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Try to authenticate when the screen loads
    handleAuthentication()
  }, [])

  const handleAuthentication = async () => {
    try {
      // Check if device has biometric hardware
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      if (!hasHardware) {
        // If no biometric hardware, just authenticate with device ID
        await authenticate()
        router.replace("/(app)/home")
        return
      }

      // Check if biometrics are enrolled
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      if (!isEnrolled) {
        // If no biometrics enrolled, just authenticate with device ID
        await authenticate()
        router.replace("/(app)/home")
        return
      }

      // Authenticate with biometrics
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access TaskBuddy",
        fallbackLabel: "Use passcode",
      })

      if (result.success) {
        // If biometric auth succeeds, authenticate with the API
        await authenticate()
        router.replace("/(app)/home")
      } else {
        setAuthError(result.error || "Authentication failed")
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setAuthError("An error occurred during authentication")
    }
  }

  const handlePasswordAuth = async () => {
    try {
      // Skip biometrics and just authenticate with device ID
      await authenticate()
      router.replace("/(app)/home")
    } catch (error) {
      console.error('Password authentication error:', error)
      setAuthError("Authentication failed. Please try again.")
    }
  }

  return (
    <LinearGradient
      colors={["#2D2D2D", "#4B0082"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Unlock TaskBuddy</Text>

        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Fingerprint size={100} color={COLORS.neonTeal} strokeWidth={1.5} />
          <View style={styles.ripple1} />
          <View style={styles.ripple2} />
        </Animated.View>

        <Text style={styles.subHeaderText}>Use your fingerprint or face ID</Text>

        {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

        <TouchableOpacity 
          style={[styles.authButton, isLoading && styles.disabledButton]} 
          activeOpacity={0.8} 
          onPress={handleAuthentication}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.darkBackground} size="small" />
          ) : (
            <Text style={styles.authButtonText}>Try Again</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.passwordButton, isLoading && styles.disabledButton]} 
          activeOpacity={0.8} 
          onPress={handlePasswordAuth}
          disabled={isLoading}
        >
          <Key size={16} color={COLORS.hotPink} style={styles.passwordIcon} />
          <Text style={styles.passwordButtonText}>Use Password Instead</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    width: "80%",
    alignItems: "center",
  },
  headerText: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    color: "#FFFFFF",
    marginBottom: 40,
    textAlign: "center",
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: `rgba(0, 255, 209, 0.1)`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    position: "relative",
  },
  ripple1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: `rgba(0, 255, 209, 0.2)`,
    opacity: 0.7,
  },
  ripple2: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: `rgba(0, 255, 209, 0.1)`,
    opacity: 0.5,
  },
  subHeaderText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#E5E7EB",
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#FF4D6D",
    marginBottom: 20,
    textAlign: "center",
  },
  authButton: {
    backgroundColor: COLORS.neonTeal,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  authButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: COLORS.darkBackground,
  },
  passwordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.hotPink,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  passwordIcon: {
    marginRight: 8,
  },
  passwordButtonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: COLORS.hotPink,
  },
})


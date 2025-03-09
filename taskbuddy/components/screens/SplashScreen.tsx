"use client"

import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Animated, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { COLORS } from "../../constants/theme"
import { healthApi } from "@/services/api"

export default function SplashScreen() {
  // Animation values
  const fadeAnim = new Animated.Value(0)
  const scaleAnim = new Animated.Value(0.8)
  const [isLoading, setIsLoading] = useState(true)
  const [apiStatus, setApiStatus] = useState<string>('')

  useEffect(() => {
    // Check API health
    const checkApiHealth = async () => {
      try {
        const health = await healthApi.checkHealth();
        setApiStatus(health.status);
      } catch (error) {
        console.log('API health check failed:', error);
        setApiStatus('offline');
      }
    };

    // Start animations
    const startAnimations = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1, 
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsLoading(false)
      })
    };

    // Run both in parallel
    Promise.all([
      checkApiHealth(),
      startAnimations()
    ]);
  }, [])

  return (
    <LinearGradient
      colors={[COLORS.electricPurple || '#6200ee', COLORS.neonTeal || '#03dac6']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <Text style={styles.logoText}>TaskBuddy</Text>
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator 
              size="large" 
              color="#FFFFFF" 
              style={styles.loader} 
            />
            <Text style={styles.statusText}>
              {apiStatus === 'ok' ? 'Loading...' : 'Connecting...'}
            </Text>
          </View>
        )}
      </Animated.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  checkmark: {
    fontSize: 70,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  logoText: {
    fontSize: 42,
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loader: {
    marginBottom: 15,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  }
})


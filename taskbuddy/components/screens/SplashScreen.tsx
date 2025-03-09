"use client"

import React, { useEffect } from "react"
import { View, Text, StyleSheet, Animated } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { COLORS } from "../../constants/theme"
import { Sparkles, Zap } from "lucide-react-native"

export default function SplashScreen() {
  const fadeAnim = new Animated.Value(0)
  const scaleAnim = new Animated.Value(0.8)
  const glowAnim = new Animated.Value(0)

  useEffect(() => {
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        // Subtle glow animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: false,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: false,
            }),
          ])
        ),
      ]),
    ]).start()
  }, [])

  return (
    <LinearGradient
      colors={[COLORS.darkBackground, COLORS.deepPurple]}
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
        <View style={styles.logoWrapper}>
          <LinearGradient
            colors={[COLORS.neonTeal, COLORS.electricPurple]}
            style={styles.logoCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Sparkles 
              size={24} 
              color="#FFFFFF" 
              style={[styles.sparkleTop]}
            />
            <Zap
              size={24}
              color="#FFFFFF"
              style={styles.sparkleBottom}
              fill="#FFFFFF"
            />
            <Animated.View 
              style={[
                styles.innerCircle,
                {
                  shadowOpacity: glowAnim,
                }
              ]}
            >
              <Text style={styles.logoLetter}>tb</Text>
            </Animated.View>
          </LinearGradient>
        </View>
        <Text style={styles.logoText}>TaskBuddy</Text>
        <Text style={styles.tagline}>Level Up Your Productivity ⚡️</Text>
      </Animated.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.darkBackground,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoWrapper: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 130,
    height: 130,
    borderRadius: 35, // More squared corners for modern look
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.neonTeal,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  innerCircle: {
    width: 90,
    height: 90,
    borderRadius: 25, // Matching the outer circle style
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(5px)',
    shadowColor: COLORS.neonTeal,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
  },
  logoLetter: {
    fontSize: 42,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    letterSpacing: -2,
    textTransform: 'lowercase', // More modern look
  },
  sparkleTop: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  sparkleBottom: {
    position: 'absolute',
    bottom: 15,
    left: 15,
  },
  logoText: {
    fontSize: 44,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -2,
  },
  tagline: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    color: COLORS.neonTeal,
    opacity: 0.9,
    marginTop: 8,
    letterSpacing: 0.5,
  },
})

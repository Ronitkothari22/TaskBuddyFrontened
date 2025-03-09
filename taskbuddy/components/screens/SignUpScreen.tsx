"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react-native"
import { COLORS } from "../../constants/theme"

export default function SignUpScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSignUp = () => {
    // In a real app, you would validate and create an account
    router.replace("/(auth)/auth")
  }

  const handleLogin = () => {
    // In a real app, this would navigate to login
    router.replace("/(auth)/auth")
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Get Started with TaskBuddy <Sparkles size={24} color={COLORS.hotPink} />
          </Text>
          <Text style={styles.subHeaderText}>
            Create an account to start organizing your tasks and job applications
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Mail size={20} color={COLORS.neonTeal} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={COLORS.neonTeal} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={COLORS.neonTeal} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              {showConfirmPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
            </Pressable>
          </View>

          <TouchableOpacity style={styles.signUpButton} activeOpacity={0.8} onPress={handleSignUp}>
            <LinearGradient
              colors={[COLORS.neonTeal, "#00CCAA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBackground,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  headerContainer: {
    marginBottom: 40,
  },
  headerText: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    color: COLORS.hotPink,
    marginBottom: 12,
    textAlign: "center",
  },
  subHeaderText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#E5E7EB",
    textAlign: "center",
    marginHorizontal: 10,
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D2D2D",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.neonTeal,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  signUpButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: COLORS.neonTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: COLORS.darkBackground,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#E5E7EB",
    marginRight: 4,
  },
  loginLink: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: COLORS.neonTeal,
    textDecorationLine: "underline",
  },
})


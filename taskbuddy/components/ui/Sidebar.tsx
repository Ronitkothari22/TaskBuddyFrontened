import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from "react-native"
import { CheckCircle2, Briefcase, X, Settings, BarChart2, LogOut } from "lucide-react-native"
import { COLORS } from "../../constants/theme"
import { useAuth } from "@/contexts/AuthContext"

interface SidebarProps {
  animStyle: any;
  onClose: () => void;
}

export default function Sidebar({ animStyle, onClose }: SidebarProps) {
  const { user, logout, isLoading } = useAuth()

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            await logout()
            onClose()
          }
        }
      ]
    )
  }

  return (
    <Animated.View style={[styles.sidebar, animStyle]}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.sidebarTitle}>Menu</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      )}

      <View style={styles.sidebarContent}>
        <TouchableOpacity style={styles.sidebarItem}>
          <CheckCircle2 size={20} color={COLORS.neonTeal} style={styles.sidebarIcon} />
          <Text style={styles.sidebarItemText}>All Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sidebarItem}>
          <Briefcase size={20} color={COLORS.hotPink} style={styles.sidebarIcon} />
          <Text style={styles.sidebarItemText}>Job Tracker</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sidebarItem}>
          <BarChart2 size={20} color="#FFD700" style={styles.sidebarIcon} />
          <Text style={styles.sidebarItemText}>Stats</Text>
        </TouchableOpacity> 

        <TouchableOpacity style={styles.sidebarItem}>
          <Settings size={20} color="#E5E7EB" style={styles.sidebarIcon} />
          <Text style={styles.sidebarItemText}>Settings</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          disabled={isLoading}
        >
          <LogOut size={20} color="#FF4D6D" style={styles.sidebarIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 300,
    height: "100%",
    backgroundColor: "#2D2D2D",
    zIndex: 2,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  sidebarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sidebarTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#FFFFFF",
  },
  userInfo: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  userName: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#9CA3AF",
  },
  sidebarContent: {
    flex: 1,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  sidebarIcon: {
    marginRight: 16,
  },
  sidebarItemText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#FFFFFF",
  },
  spacer: {
    flex: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 20,
  },
  logoutText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#FF4D6D",
  },
})


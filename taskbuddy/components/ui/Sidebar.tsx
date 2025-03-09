import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native"
import { CheckCircle2, Briefcase, X, Settings, BarChart2 } from "lucide-react-native"
import { COLORS } from "../../constants/theme"

export default function Sidebar({ animStyle, onClose }) {
  return (
    <Animated.View style={[styles.sidebar, animStyle]}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.sidebarTitle}>Menu</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

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
    marginBottom: 30,
  },
  sidebarTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#FFFFFF",
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
})


"use client"

import { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  FlatList,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Plus, Menu, CheckCircle2, Circle, ChevronDown, ChevronUp, Briefcase, X } from "lucide-react-native"
import { format, addDays, isSameDay } from "date-fns"

const { width } = Dimensions.get("window")

// Sample data
const INITIAL_TASKS = [
  { id: "1", title: "Update resume", time: "10:00 AM", completed: false },
  { id: "2", title: "Research companies", time: "12:30 PM", completed: true },
  { id: "3", title: "Prepare for interview", time: "3:00 PM", completed: false },
  { id: "4", title: "Send follow-up emails", time: "5:00 PM", completed: false },
]

const JOB_APPLICATIONS = [
  {
    id: "1",
    company: "TechCorp",
    position: "Frontend Developer",
    status: "Applied",
    statusColor: "#FFD700", // Yellow
    date: "2023-10-15",
  },
  {
    id: "2",
    company: "DesignHub",
    position: "UI/UX Designer",
    status: "Interview",
    statusColor: "#00FFD1", // Teal
    date: "2023-10-18",
  },
  {
    id: "3",
    company: "InnovateLabs",
    position: "Mobile Developer",
    status: "Offer",
    statusColor: "#00FF7F", // Green
    date: "2023-10-20",
  },
]

export default function HomeScreen() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [jobSectionExpanded, setJobSectionExpanded] = useState(true)
  const [sidebarVisible, setSidebarVisible] = useState(false)

  const sidebarAnim = useRef(new Animated.Value(-300)).current
  const overlayAnim = useRef(new Animated.Value(0)).current

  // Generate dates for the calendar
  const dates = Array(7)
    .fill(0)
    .map((_, i) => addDays(new Date(), i - 3))

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const toggleJobSection = () => {
    setJobSectionExpanded(!jobSectionExpanded)
  }

  const toggleSidebar = () => {
    if (sidebarVisible) {
      // Hide sidebar
      Animated.parallel([
        Animated.timing(sidebarAnim, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setSidebarVisible(false))
    } else {
      // Show sidebar
      setSidebarVisible(true)
      Animated.parallel([
        Animated.timing(sidebarAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }

  const renderDateItem = ({ item }) => {
    const isSelected = isSameDay(item, selectedDate)
    const dayName = format(item, "EEE")
    const dayNumber = format(item, "d")
    const isToday = isSameDay(item, new Date())

    return (
      <TouchableOpacity
        style={[styles.dateItem, isSelected && styles.selectedDateItem, isToday && styles.todayDateItem]}
        onPress={() => setSelectedDate(item)}
      >
        <Text
          style={[
            styles.dayName,
            isSelected && styles.selectedDateText,
            isToday && !isSelected && styles.todayDateText,
          ]}
        >
          {dayName}
        </Text>
        <Text
          style={[
            styles.dayNumber,
            isSelected && styles.selectedDateText,
            isToday && !isSelected && styles.todayDateText,
          ]}
        >
          {dayNumber}
        </Text>
      </TouchableOpacity> 
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <Menu size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TaskBuddy</Text>
        <TouchableOpacity>
          <Image source={{ uri: "https://i.pravatar.cc/100" }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>Hey Alex 👋</Text>
        <Text style={styles.dateText}>{format(new Date(), "EEEE, MMMM d")}</Text>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <FlatList
          horizontal
          data={dates}
          renderItem={renderDateItem}
          keyExtractor={(item) => item.toISOString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarList}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tasks Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          <Text style={styles.taskCount}>{tasks.filter((t) => !t.completed).length} remaining</Text>
        </View>

        {tasks.map((task) => (
          <Animated.View key={task.id} style={styles.taskCard}>
            <TouchableOpacity style={styles.taskCheckbox} onPress={() => toggleTaskCompletion(task.id)}>
              {task.completed ? <CheckCircle2 size={24} color="#FF007A" /> : <Circle size={24} color="#00FFD1" />}
            </TouchableOpacity>
            <View style={styles.taskContent}>
              <Text style={[styles.taskTitle, task.completed && styles.completedTaskTitle]}>{task.title}</Text>
              <Text style={styles.taskTime}>{task.time}</Text>
            </View>
          </Animated.View>
        ))}

        {/* Job Applications Section */}
        <TouchableOpacity style={styles.jobSectionHeader} onPress={toggleJobSection}>
          <View style={styles.jobSectionTitleContainer}>
            <Briefcase size={20} color="#FF007A" style={styles.jobIcon} />
            <Text style={styles.jobSectionTitle}>Job Hunt Vibes</Text>
          </View>
          {jobSectionExpanded ? <ChevronUp size={20} color="#FFFFFF" /> : <ChevronDown size={20} color="#FFFFFF" />}
        </TouchableOpacity>

        {jobSectionExpanded && (
          <View style={styles.jobsContainer}>
            {JOB_APPLICATIONS.map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <View style={styles.jobInfo}>
                  <Text style={styles.companyName}>{job.company}</Text>
                  <Text style={styles.positionName}>{job.position}</Text>
                  <View style={[styles.statusTag, { backgroundColor: `${job.statusColor}20` }]}>
                    <Text style={[styles.statusText, { color: job.statusColor }]}>{job.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Spacer for FAB */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient
          colors={["#00FFD1", "#00CCAA"]}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Plus size={24} color="#1A1A1A" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Sidebar Overlay */}
      {sidebarVisible && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayAnim,
            },
          ]}
          pointerEvents={sidebarVisible ? "auto" : "none"}
          onTouchStart={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      {sidebarVisible && (
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: sidebarAnim }],
            },
          ]}
        >
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Menu</Text>
            <TouchableOpacity onPress={toggleSidebar}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.sidebarContent}>
            <TouchableOpacity style={styles.sidebarItem}>
              <CheckCircle2 size={20} color="#00FFD1" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>All Tasks</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItem}>
              <Briefcase size={20} color="#FF007A" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>Job Tracker</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItem}>
              <Image source={{ uri: "/placeholder.svg?height=20&width=20" }} style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>Stats</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItem}>
              <Image source={{ uri: "/placeholder.svg?height=20&width=20" }} style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: "#FFFFFF",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#00FFD1",
  },
  greeting: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greetingText: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#FFFFFF",
  },
  dateText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#9CA3AF",
  },
  calendarContainer: {
    marginBottom: 20,
  },
  calendarList: {
    paddingHorizontal: 16,
  },
  dateItem: {
    width: 60,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#2D2D2D",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  selectedDateItem: {
    backgroundColor: "#FF007A",
  },
  todayDateItem: {
    borderWidth: 1,
    borderColor: "#00FFD1",
  },
  dayName: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  dayNumber: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  selectedDateText: {
    color: "#FFFFFF",
  },
  todayDateText: {
    color: "#00FFD1",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  taskCount: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#00FFD1",
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333333",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  taskCheckbox: {
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  completedTaskTitle: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  taskTime: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#00FFD1",
  },
  jobSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2D2D2D",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  jobSectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  jobIcon: {
    marginRight: 8,
  },
  jobSectionTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#FF007A",
  },
  jobsContainer: {
    marginBottom: 20,
  },
  jobCard: {
    backgroundColor: "#333333",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  companyName: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  positionName: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#E5E7EB",
    marginBottom: 8,
  },
  statusTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#00FFD1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
    zIndex: 1,
  },
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
    width: 20,
    height: 20,
  },
  sidebarItemText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#FFFFFF",
  },
})


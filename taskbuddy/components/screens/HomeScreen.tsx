"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, FlatList, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Plus, Menu, ChevronDown, ChevronUp, Briefcase } from "lucide-react-native"
import { format, addDays, isSameDay } from "date-fns"
import { COLORS } from "@/constants/theme"
import { TASKS, JOB_APPLICATIONS } from "@/data/mockData"
import TaskItem from "@/components/ui/TaskItem"
import JobCard from "@/components/ui/JobCard"
import CalendarDay from "@/components/ui/CalendarDay"
import Sidebar from "@/components/ui/Sidebar"

export default function HomeScreen() {
  const [tasks, setTasks] = useState(TASKS)
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
          renderItem={({ item }) => (
            <CalendarDay
              date={item}
              isSelected={isSameDay(item, selectedDate)}
              onSelect={() => setSelectedDate(item)}
            />
          )}
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
          <TaskItem key={task.id} task={task} onToggle={() => toggleTaskCompletion(task.id)} />
        ))}

        {/* Job Applications Section */}
        <TouchableOpacity style={styles.jobSectionHeader} onPress={toggleJobSection}>
          <View style={styles.jobSectionTitleContainer}>
            <Briefcase size={20} color={COLORS.hotPink} style={styles.jobIcon} />
            <Text style={styles.jobSectionTitle}>Job Hunt Vibes</Text>
          </View>
          {jobSectionExpanded ? <ChevronUp size={20} color="#FFFFFF" /> : <ChevronDown size={20} color="#FFFFFF" />}
        </TouchableOpacity>

        {jobSectionExpanded && (
          <View style={styles.jobsContainer}>
            {JOB_APPLICATIONS.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </View>
        )}

        {/* Spacer for FAB */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient
          colors={[COLORS.neonTeal, "#00CCAA"]}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Plus size={24} color={COLORS.darkBackground} />
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
      {sidebarVisible && <Sidebar animStyle={{ transform: [{ translateX: sidebarAnim }] }} onClose={toggleSidebar} />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBackground,
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
    borderColor: COLORS.neonTeal,
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
    color: COLORS.neonTeal,
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
    color: COLORS.hotPink,
  },
  jobsContainer: {
    marginBottom: 20,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 30,
    elevation: 8,
    shadowColor: COLORS.neonTeal,
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
})


"use client"

import { useState, useRef, useEffect } from "react"
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  FlatList, 
  Image,
  ActivityIndicator,
  RefreshControl
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Plus, Menu, ChevronDown, ChevronUp, Briefcase } from "lucide-react-native"
import { format, addDays, isSameDay } from "date-fns"
import { COLORS } from "@/constants/theme"
import { TASK_STATUS } from "@/constants/api"
import TaskItem from "@/components/ui/TaskItem"
import JobCard from "@/components/ui/JobCard"
import CalendarDay from "@/components/ui/CalendarDay"
import Sidebar from "@/components/ui/Sidebar"
import { useData } from "@/contexts/DataContext"
import { useAuth } from "@/contexts/AuthContext"

export default function HomeScreen() {
  const { user } = useAuth()
  const { 
    tasks, 
    isLoadingTasks, 
    refreshTasks, 
    updateTask,
    jobs,
    isLoadingJobs,
    refreshJobs
  } = useData()
  
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [jobSectionExpanded, setJobSectionExpanded] = useState(true)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
 
  const sidebarAnim = useRef(new Animated.Value(-300)).current
  const overlayAnim = useRef(new Animated.Value(0)).current

  // Generate dates for the calendar
  const dates = Array(7)
    .fill(0)
    .map((_, i) => addDays(new Date(), i - 3))

  // Refresh data when component mounts
  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = async () => {
    setRefreshing(true)
    await Promise.all([refreshTasks(), refreshJobs()])
    setRefreshing(false)
  }

  const toggleTaskCompletion = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === TASK_STATUS.COMPLETED 
      ? TASK_STATUS.PENDING 
      : TASK_STATUS.COMPLETED
    
    await updateTask(taskId, { status: newStatus })
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

  // Get remaining tasks count
  const remainingTasksCount = tasks.filter(task => task.status !== TASK_STATUS.COMPLETED).length

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
        <Text style={styles.greetingText}>Hey {user?.name?.split(' ')[0] || 'there'} 👋</Text>
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

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshData}
            colors={[COLORS.neonTeal]}
            tintColor={COLORS.neonTeal}
          />
        }
      >
        {/* Tasks Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          <Text style={styles.taskCount}>{remainingTasksCount} remaining</Text>
        </View>

        {isLoadingTasks && !refreshing ? (
          <ActivityIndicator color={COLORS.neonTeal} style={styles.loader} />
        ) : tasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks yet. Add your first task!</Text>
        ) : (
          tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={() => toggleTaskCompletion(task.id, task.status)} 
            />
          ))
        )}

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
            {isLoadingJobs && !refreshing ? (
              <ActivityIndicator color={COLORS.hotPink} style={styles.loader} />
            ) : jobs.length === 0 ? (
              <Text style={styles.emptyText}>No job applications yet. Start your job hunt!</Text>
            ) : (
              jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            )}
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
  loader: {
    marginVertical: 20,
  },
  emptyText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginVertical: 20,
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
    fontSize: 16,
    color: "#FFFFFF",
  },
  jobsContainer: {
    marginBottom: 16,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 8,
    shadowColor: COLORS.neonTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
  },
})


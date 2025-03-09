import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { CheckCircle2, Circle } from "lucide-react-native"
import { COLORS } from "../../constants/theme"
import { Task } from "@/services/api"
import { TASK_STATUS } from "@/constants/api"
import { format, parseISO } from "date-fns"

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
}

export default function TaskItem({ task, onToggle }: TaskItemProps) {
  const isCompleted = task.status === TASK_STATUS.COMPLETED;
  
  // Format the task creation time
  const formattedTime = task.createdAt 
    ? format(parseISO(task.createdAt), "h:mm a")
    : "";

  return (
    <View style={styles.taskCard}>
      <TouchableOpacity style={styles.taskCheckbox} onPress={onToggle}>
        {isCompleted ? (
          <CheckCircle2 size={24} color={COLORS.hotPink} />
        ) : (
          <Circle size={24} color={COLORS.neonTeal} />
        )}
      </TouchableOpacity>
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, isCompleted && styles.completedTaskTitle]}>{task.title}</Text>
        {task.description && (
          <Text style={[styles.taskDescription, isCompleted && styles.completedTaskTitle]}>
            {task.description}
          </Text>
        )}
        <Text style={styles.taskTime}>{formattedTime}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({ 
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
  taskDescription: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#E5E7EB",
    marginBottom: 4,
  },
  completedTaskTitle: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  taskTime: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: COLORS.neonTeal,
  },
})


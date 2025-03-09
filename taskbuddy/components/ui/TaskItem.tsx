import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { CheckCircle2, Circle } from "lucide-react-native"
import { COLORS } from "../../constants/theme"

export default function TaskItem({ task, onToggle }) {
  return (
    <View style={styles.taskCard}>
      <TouchableOpacity style={styles.taskCheckbox} onPress={onToggle}>
        {task.completed ? (
          <CheckCircle2 size={24} color={COLORS.hotPink} />
        ) : (
          <Circle size={24} color={COLORS.neonTeal} />
        )}
      </TouchableOpacity>
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, task.completed && styles.completedTaskTitle]}>{task.title}</Text>
        <Text style={styles.taskTime}>{task.time}</Text>
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


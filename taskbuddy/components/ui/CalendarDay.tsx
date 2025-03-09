import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { format, isSameDay } from "date-fns"
import { COLORS } from "../../constants/theme"

export default function CalendarDay({ date, isSelected, onSelect }) {
  const dayName = format(date, "EEE")
  const dayNumber = format(date, "d")
  const isToday = isSameDay(date, new Date())

  return (
    <TouchableOpacity
      style={[styles.dateItem, isSelected && styles.selectedDateItem, isToday && styles.todayDateItem]}
      onPress={onSelect}
    >
      <Text
        style={[styles.dayName, isSelected && styles.selectedDateText, isToday && !isSelected && styles.todayDateText]}
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

const styles = StyleSheet.create({
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
    backgroundColor: COLORS.hotPink,
  },
  todayDateItem: {
    borderWidth: 1,
    borderColor: COLORS.neonTeal,
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
    color: COLORS.neonTeal,
  },
})


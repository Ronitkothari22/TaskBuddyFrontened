import { View, Text, StyleSheet } from "react-native"

export default function JobCard({ job }) {
  return (
    <View style={styles.jobCard}>
      <View style={styles.jobInfo}>
        <Text style={styles.companyName}>{job.company}</Text>
        <Text style={styles.positionName}>{job.position}</Text>
        <View style={[styles.statusTag, { backgroundColor: `${job.statusColor}20` }]}>
          <Text style={[styles.statusText, { color: job.statusColor }]}>{job.status}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
})


import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native"
import { ExternalLink } from "lucide-react-native"
import { Job } from "@/services/api"
import { JOB_STATUS_COLORS, JOB_STATUS } from "@/constants/api"
import { COLORS } from "@/constants/theme"

interface JobCardProps {
  job: Job;
  onPress?: () => void;
}

export default function JobCard({ job, onPress }: JobCardProps) {
  // Get the color for the job status
  const statusColor = job.status && 
    Object.values(JOB_STATUS).includes(job.status as any) ? 
    JOB_STATUS_COLORS[job.status as keyof typeof JOB_STATUS_COLORS] : 
    COLORS.neonTeal;
  
  const handleLinkPress = async () => {
    if (job.link) {
      const canOpen = await Linking.canOpenURL(job.link);
      if (canOpen) {
        await Linking.openURL(job.link);
      }
    }
  };

  return (
    <TouchableOpacity style={styles.jobCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.jobInfo}>
        <Text style={styles.companyName}>{job.company}</Text>
        <Text style={styles.positionName}>{job.title}</Text>
        
        <View style={styles.jobFooter}>
          <View style={[styles.statusTag, { backgroundColor: `${statusColor}20` }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{job.status}</Text>
          </View>
          
          {job.link && (
            <TouchableOpacity style={styles.linkButton} onPress={handleLinkPress}>
              <ExternalLink size={16} color={COLORS.neonTeal} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  linkButton: {
    padding: 4,
  },
})


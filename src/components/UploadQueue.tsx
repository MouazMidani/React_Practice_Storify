// components/UploadQueue.tsx
import React, { useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { X, File, Check, AlertCircle } from "lucide-react-native"
import { useUploadStore } from "../../lib/stores/UploadStore"
import { Colors } from "../../Styleguide"

const UploadItem = ({ file, onCancel }) => {
  const progressAnim = useRef(new Animated.Value(file.progress)).current

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: file.progress,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [file.progress])

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  })

  return (
    <View style={styles.uploadItem}>
      <View style={styles.uploadItemHeader}>
        <View style={styles.uploadItemInfo}>
          <File size={16} color={Colors.oxfordBlue} />
          <Text style={styles.uploadItemName} numberOfLines={1}>
            {file.name}
          </Text>
        </View>
        {file.status === "uploading" && (
          <TouchableOpacity onPress={() => onCancel(file.id)} style={styles.cancelBtn}>
            <X size={16} color={Colors.oxfordBlue} />
          </TouchableOpacity>
        )}
        {file.status === "completed" && <Check size={16} color={Colors.orangeWeb} />}
        {file.status === "error" && <AlertCircle size={16} color="#e63946" />}
      </View>
      <View style={styles.progressBarBg}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressWidth,
              backgroundColor:
                file.status === "error"
                  ? "#e63946"
                  : file.status === "completed"
                  ? Colors.orangeWeb
                  : Colors.oxfordBlue,
            },
          ]}
        />
      </View>
      <Text style={styles.uploadItemSize}>
        {file.status === "error"
          ? "Upload failed"
          : `${file.progress}% • ${formatFileSize(file.size)}`}
      </Text>
    </View>
  )
}

const UploadQueue = () => {
  const { uploads, removeUpload } = useUploadStore()

  if (!uploads.length) return null

  return (
    <View style={styles.uploadQueue}>
      <View style={styles.uploadQueueHeader}>
        <Text style={styles.uploadQueueTitle}>Uploads ({uploads.length})</Text>
      </View>
      <ScrollView style={styles.uploadQueueList} showsVerticalScrollIndicator={false}>
        {uploads.map((file) => (
          <UploadItem key={file.id} file={file} onCancel={removeUpload} />
        ))}
      </ScrollView>
    </View>
  )
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

const styles = StyleSheet.create({
  uploadQueue: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 320,
    maxHeight: 400,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.platinum,
    zIndex: 100
  },
  uploadQueueHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.platinum,
  },
  uploadQueueTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.oxfordBlue,
  },
  uploadQueueList: {
    maxHeight: 320,
  },
  uploadItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.platinum,
  },
  uploadItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  uploadItemInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  uploadItemName: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.oxfordBlue,
    flex: 1,
  },
  cancelBtn: {
    padding: 4,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.platinum,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  uploadItemSize: {
    fontSize: 12,
    color: "#666",
  },
})

export default UploadQueue
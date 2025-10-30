import React, { FC, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native"
import Colors, { util } from "../../Styleguide"
import { downloadFile, formatDateTime, formatFileSize } from "../../lib/util"
import { deleteFile, renameFile, shareFile } from "../../lib/hooks/useFiles"
import CardModal from "./CardModal"
interface FileDocument {
  name: string
  url: string
  type: "image" | "document" | "media" | "audio" | "other"
  extension: string
  size: number
  $createdAt: string
  owner?: string
  $id?: string
  bucketField?: string
}

interface CardProps {
  file: FileDocument,
  user: any
}

const Card: FC<CardProps> = ({ file, user }) => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'details' | 'rename' | 'delete' | 'share'>('details')

  const handleDownload = () => downloadFile(file.url)
  const handleMenuAction = (action: () => void) => {
    setMenuVisible(false)
    action()
  }

  const menuItems = [
    { label: "Rename", icon: "✏️", action: () => { setModalType("rename"); setModalVisible(true) }},
    { label: "Details", icon: "ℹ️", action: () => { setModalType("details"); setModalVisible(true) }},
    { label: "Share", icon: "📤", action: () => { setModalType("share"); setModalVisible(true) }},
    { label: "Download", icon: "⬇️", action: handleDownload },
    { label: "Move to Trash", icon: "🗑️", action: () => { setModalType("delete"); setModalVisible(true) }, danger: true}
  ]

  const getFileIcon = (): string => {
    switch (file.type) {
      case "image": return "🖼️"
      case "document": return "📄"
      case "media": return "🎬"
      case "audio": return "🎵"
      default: return "📎"
    }
  }

  const renderPreview = () => {
    return file.type === "image" 
    ? (<Image source={{ uri: file.url }} style={styles.imagePreview} resizeMode="cover" />)
    : (
      <View style={styles.iconPreview}>
        <Text style={styles.fileIcon}>{getFileIcon()}</Text>
        <Text style={styles.extensionBadge}>{file.extension.toUpperCase()}</Text>
      </View>
    )
  }

  const handleShare = (email: string) => {
    if (email.trim()) {
      shareFile(file.$id, [email])
      setModalVisible(false)
    }
  }

  const handleDelete = () => {
    file.$id && deleteFile(file.$id)
    setModalVisible(false)
  }

  const handleRename = (newName: string) => {
    renameFile(file.$id, newName)
    setModalVisible(false)
  }

  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => console.log(`Card pressed: ${file.name}`)}
        activeOpacity={0.7}
      >
        <View style={styles.previewContainer}>
          {renderPreview()}

          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{file.type}</Text>
          </View>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={(e: any) => {
              e.stopPropagation?.()
              setMenuVisible(!menuVisible)
            }}
            activeOpacity={0.7}
          >
            <View style={styles.menuDot} />
            <View style={styles.menuDot} />
            <View style={styles.menuDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.fileName} numberOfLines={2}>
            {file.name}
          </Text>

          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>{formatFileSize(file.size)}</Text>
            <View style={styles.metaDivider} />
            <Text style={styles.metaText}>{formatDateTime(file.$createdAt)}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {menuVisible && (
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label + index}
              style={[styles.menuItem, index === menuItems.length - 1 && styles.menuItemLast]}
              onPress={() => handleMenuAction(item.action)}
              activeOpacity={0.7}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <CardModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalType}
        file={file}
        user={user}
        onRename={(newName) => handleRename(newName)}
        onDelete={() => handleDelete}
        onShare={(email: string) => handleShare(email)}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  cardWrapper: {
    position: "relative",
    marginVertical: 8,
    marginHorizontal: 16,
  },
  card: {
    width: 280,
    height: 320,
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: Colors.oxfordBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  previewContainer: {
    height: 200,
    backgroundColor: Colors.light[400],
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  iconPreview: {
    width: "100%",
    height: "100%",
    ...util.center,
    backgroundColor: Colors.platinumShades[200],
  },
  fileIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  extensionBadge: {
    ...util.caption,
    color: Colors.oxfordBlue,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: "600",
    overflow: "hidden",
  },
  typeBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: Colors.orangeWeb,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    ...util.caption,
    color: Colors.white,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  menuButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: Colors.white,
    width: 32,
    height: 32,
    borderRadius: 16,
    ...util.center,
    shadowColor: Colors.oxfordBlue,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.oxfordBlue,
    marginVertical: 1.5,
  },
  contentContainer: {
    padding: 16,
    height: 120,
    justifyContent: "space-between",
  },
  fileName: {
    ...util.subtitle1,
    color: Colors.oxfordBlue,
    fontWeight: "600",
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    ...util.caption,
    color: Colors.light[200],
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light[300],
    marginHorizontal: 8,
  },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  modalOverlayWrapper: {
    flex: 1,
    zIndex: 2,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: 8
  },
  menuContainer: {
    position: "absolute",
    top: 50,
    right: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    minWidth: 160,
    overflow: "hidden",
    shadowColor: Colors.oxfordBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 999,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light[300],
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuLabel: {
    ...util.body2,
    color: Colors.oxfordBlue,
    fontWeight: "500",
  },
  menuLabelDanger: {
    color: Colors.error,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  
  cardMenuWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 12,
    paddingRight: 12,
    zIndex: 2,
  },
})

export default Card

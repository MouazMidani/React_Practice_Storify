import { FC, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Pressable } from 'react-native'
import Colors, { util } from '../../Styleguide'

interface FileDocument {
  name: string
  url: string
  type: 'image' | 'document' | 'media' | 'audio' | 'other'
  extension: string
  size: number
  $createdAt: string
  owner?: string
}

interface CardProps {
  file: FileDocument
  onPress?: () => void
  onRename?: () => void
  onDetails?: () => void
  onShare?: () => void
  onDownload?: () => void
  onMoveToTrash?: () => void
}

const Card: FC<CardProps> = ({ 
  file, 
  onPress,
  onRename,
  onDetails,
  onShare,
  onDownload,
  onMoveToTrash
}) => {
  const [menuVisible, setMenuVisible] = useState(false)

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const getFileIcon = (): string => {
    switch (file.type) {
      case 'image':
        return '🖼️'
      case 'document':
        return '📄'
      case 'media':
        return '🎬'
      case 'audio':
        return '🎵'
      default:
        return '📎'
    }
  }

  const handleMenuAction = (action: () => void | undefined) => {
    setMenuVisible(false)
    if (action) {
      action()
    }
  }

  const menuItems = [
    { label: 'Rename', icon: '✏️', action: onRename },
    { label: 'Details', icon: 'ℹ️', action: onDetails },
    { label: 'Share', icon: '📤', action: onShare },
    { label: 'Download', icon: '⬇️', action: onDownload },
    { label: 'Move to Trash', icon: '🗑️', action: onMoveToTrash, danger: true },
  ]

  const renderPreview = () => {
    if (file.type === 'image') {
      return (
        <Image 
          source={{ uri: file.url }} 
          style={styles.imagePreview}
          resizeMode="cover"
        />
      )
    }
    
    return (
      <View style={styles.iconPreview}>
        <Text style={styles.fileIcon}>{getFileIcon()}</Text>
        <Text style={styles.extensionBadge}>{file.extension.toUpperCase()}</Text>
      </View>
    )
  }

  return (
    <>
      <View style={styles.cardWrapper}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View style={styles.previewContainer}>
            {renderPreview()}
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{file.type}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={(e) => {
                e.stopPropagation()
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
              <Text style={styles.metaText}>{formatDate(file.$createdAt)}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {menuVisible && (
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.menuItemLast
                ]}
                onPress={() => handleMenuAction(item.action)}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={[
                  styles.menuLabel,
                  item.danger && styles.menuLabelDanger
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {menuVisible && (
        <Modal
          visible={menuVisible}
          transparent
          animationType="none"
          onRequestClose={() => setMenuVisible(false)}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setMenuVisible(false)}
          />
        </Modal>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'relative',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  card: {
    width: 280,
    height: 320,
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.oxfordBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  previewContainer: {
    height: 200,
    backgroundColor: Colors.light[400],
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  iconPreview: {
    width: '100%',
    height: '100%',
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
    fontWeight: '600',
    overflow: 'hidden',
  },
  typeBadge: {
    position: 'absolute',
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
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  menuButton: {
    position: 'absolute',
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
    justifyContent: 'space-between',
  },
  fileName: {
    ...util.subtitle1,
    color: Colors.oxfordBlue,
    fontWeight: '600',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 52,
    right: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    minWidth: 180,
    overflow: 'hidden',
    shadowColor: Colors.oxfordBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '500',
  },
  menuLabelDanger: {
    color: Colors.error,
  },
})

export default Card
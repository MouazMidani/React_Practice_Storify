import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native'
import Colors from '../../Styleguide'

const formatDateTime = (date: string) => new Date(date).toLocaleDateString()
const formatFileSize = (size: number) => `${(size / 1024).toFixed(2)} KB`

type ModalType = 'details' | 'rename' | 'delete' | 'share'

interface UnifiedFileModalProps {
  visible: boolean
  onClose: () => void
  type: ModalType
  file: {
    $id?: string
    name: string
    url: string
    type: string
    extension: string
    size: number
    $createdAt: string
    owner?: string
    dimensions?: string
    users?: string[]
  }
  user?: any
  onRename?: (newName: string) => void
  onDelete?: () => void
  onShare?: (email: string) => void
}

const CardModal: React.FC<UnifiedFileModalProps> = ({
  visible,
  onClose,
  type,
  file,
  user,
  onRename,
  onDelete,
  onShare,
}) => {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (type === 'rename' && visible) {
      setInputValue(file.name)
    } else if (type === 'share' && visible) {
      setInputValue('')
    }
  }, [visible, type, file.name])

  const handlePrimaryAction = () => {
    switch (type) {
      case 'rename':
        if (onRename && inputValue.trim()) {
          onRename(inputValue)
          onClose()
        }
        break
      case 'delete':
        if (onDelete) {
          onDelete()
          onClose()
        }
        break
      case 'share':
        if (onShare && inputValue.trim()) {
          onShare(inputValue)
          setInputValue('')
        }
        break
      case 'details':
        onClose()
        break
    }
  }

  const renderFilePreview = () => (
    <View style={styles.previewRow}>
      <Image source={{ uri: file.url }} style={styles.imagePreview} resizeMode="cover" />
      <View style={styles.previewText}>
        <Text style={styles.fileName}>{file.name}</Text>
        <Text style={styles.fileMeta}>
          {formatFileSize(file.size)} - {formatDateTime(file.$createdAt)}
        </Text>
      </View>
    </View>
  )

  const renderContent = () => {
    switch (type) {
      case 'details':
        return (
          <>
            <Text style={styles.title}>Details</Text>
            {renderFilePreview()}
            <View style={styles.detailsContainer}>
              {[
                { label: 'Type', value: `${file.type} - ${file.extension.toUpperCase()}` },
                { label: 'Size', value: formatFileSize(file.size) },
                { label: 'Owner', value: user?.fullName },
                { label: 'Last edit', value: formatDateTime(file.$createdAt) },
              ].map(
                (item, index) =>
                  item.value && (
                    <View key={index} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{item.label}:</Text>
                      <Text style={styles.detailValue}>{item.value}</Text>
                    </View>
                  )
              )}
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
              <Text style={styles.primaryButtonText}>Close</Text>
            </TouchableOpacity>
          </>
        )

      case 'rename':
        return (
          <>
            <Text style={styles.title}>Rename File</Text>
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              style={styles.input}
              placeholder="New file name"
            />
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                onPress={handlePrimaryAction}
                style={[styles.button, styles.confirmButton]}
              >
                <Text style={styles.buttonText}>Rename</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        )

      case 'delete':
        return (
          <>
            <Text style={styles.title}>Delete File?</Text>
            <Text style={styles.message}>
              Are you sure you want to delete "{file.name}"? This action cannot be undone.
            </Text>
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                onPress={handlePrimaryAction}
                style={[styles.button, styles.confirmButton]}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        )

      case 'share':
        return (
          <>
            <Text style={styles.title}>Share File</Text>
            {renderFilePreview()}
            <Text style={styles.sectionLabel}>Share file with other users</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Shared with users</Text>
              <ScrollView style={styles.scrollView}>
                {!file.users || file.users.length === 0 ? (
                  <Text style={styles.emptyText}>No previous users</Text>
                ) : (
                  file.users.map((userEmail, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.userItem}
                      onPress={() => setInputValue(userEmail)}
                    >
                      <Text style={styles.userEmail}>{userEmail}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
            <TouchableOpacity
              style={[styles.shareButton, !inputValue.trim() && styles.shareButtonDisabled]}
              onPress={handlePrimaryAction}
              disabled={!inputValue.trim()}
            >
              <Text style={styles.primaryButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )

      default:
        return null
    }
  }

  const getModalWidth = () => {
    return type === 'rename' || type === 'delete' ? 300 : '90%'
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { width: getModalWidth() }]}>{renderContent()}</View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    maxWidth: 400,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  previewRow: {
    borderColor: Colors.platinumShades[700],
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    width: '100%',
    marginBottom: 20,
  },
  imagePreview: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  previewText: {
    flexShrink: 1,
  },
  fileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileMeta: {
    fontSize: 14,
    color: Colors.platinumShades[700],
  },
  detailsContainer: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailLabel: {
    flex: 1,
    fontWeight: '500',
    color: Colors.platinumShades[700],
  },
  detailValue: {
    flex: 2,
    fontWeight: '400',
  },
  message: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.platinumShades[300],
    borderRadius: 50,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    color: Colors.platinumShades[700],
  },
  sectionLabel: {
    alignSelf: 'flex-start',
    fontWeight: '500',
    marginLeft: 10,
    paddingBottom: 10,
    fontSize: 16,
  },
  listContainer: {
    width: '100%',
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.platinumShades[700],
    marginBottom: 8,
  },
  scrollView: {
    maxHeight: 150,
    width: '100%',
  },
  emptyText: {
    color: Colors.platinumShades[700],
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 12,
  },
  userItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.platinumShades[300],
  },
  userEmail: {
    fontSize: 14,
    color: Colors.oxfordBlue,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  confirmButton: {
    backgroundColor: Colors.orangeWeb,
  },
  cancelButton: {
    backgroundColor: Colors.light[300],
  },
  buttonText: {
    fontWeight: '600',
    color: Colors.white,
  },
  primaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: Colors.orangeWeb,
    width: '100%',
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: Colors.orangeWeb,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  shareButtonDisabled: {
    backgroundColor: Colors.orangeWebShades[200],
  },
  primaryButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  closeButton: {
    paddingVertical: 8,
  },
  closeButtonText: {
    color: Colors.oxfordBlue,
    fontSize: 16,
  },
})

export default CardModal
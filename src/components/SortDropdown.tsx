import { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native'

const SORT_OPTIONS = [
  { key: 'name-asc', value: 'Name (A-Z)' },
  { key: 'name-desc', value: 'Name (Z-A)' },
  { key: 'size-asc', value: 'Size (Smallest)' },
  { key: 'size-desc', value: 'Size (Largest)' },
  { key: '$createdAt-asc', value: 'Date (Oldest)' },
  { key: '$createdAt-desc', value: 'Date (Newest)' },
]

const SortDropdown = ({ onSortChange }: { onSortChange: (sortKey: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0])

  const handleSelect = (option: typeof SORT_OPTIONS[0]) => {
    setSelectedSort(option)
    onSortChange(option.key)
    setIsOpen(false)
  }

  return (
    <View>
      <TouchableOpacity
        style={dropdownStyles.trigger}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={dropdownStyles.triggerText}>{selectedSort.value}</Text>
        <Text style={dropdownStyles.arrow}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={dropdownStyles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={dropdownStyles.dropdown}>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  dropdownStyles.option,
                  selectedSort.key === option.key && dropdownStyles.selectedOption,
                ]}
                onPress={() => handleSelect(option)}
              >
                <Text
                  style={[
                    dropdownStyles.optionText,
                    selectedSort.key === option.key && dropdownStyles.selectedOptionText,
                  ]}
                >
                  {option.value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default SortDropdown

const dropdownStyles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  triggerText: {
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  arrow: {
    fontSize: 10,
    color: '#666',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    minWidth: 200,
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    fontWeight: '600',
    color: '#007AFF',
  },
})
import { View, Text, Modal, TouchableOpacity } from "react-native"
import { useAppStyles } from "src/styles/useAppStyles"

interface Props {
  visible: boolean
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
  danger = false,
}: Props) {
  const styles = useAppStyles()

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.confirmModalTitle}>{title}</Text>
          {message && <Text style={styles.confirmModalMessage}>{message}</Text>}

          <View style={styles.modalActions}>
            {cancelLabel !== "" && (
              <TouchableOpacity style={styles.modalCancelButton} onPress={onCancel}>
                <Text style={styles.modalCancelText}>{cancelLabel}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.modalOkButton, danger && { backgroundColor: "#e74c3c" }, cancelLabel === "" && { flex: 1 }]}
              onPress={onConfirm}
            >
              <Text style={[styles.modalOkText, danger && { color: "#fff" }]}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

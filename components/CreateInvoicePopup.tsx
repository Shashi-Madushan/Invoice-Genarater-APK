import React, { useState } from "react"
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native"

type Props = {
  visible: boolean
  onClose: () => void
  onNext: (invoiceName: string) => void
}

export default function CreateInvoicePopup({ visible, onClose, onNext }: Props) {
  const [invoiceName, setInvoiceName] = useState("")

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <View style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: 24,
          width: "80%",
          elevation: 10,
        }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>Create Invoice</Text>
          <TextInput
            placeholder="Invoice Name"
            value={invoiceName}
            onChangeText={setInvoiceName}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 10,
              marginBottom: 20,
            }}
          />
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                marginRight: 12,
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
            >
              <Text style={{ color: "#8B5CF6", fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onNext(invoiceName)
                setInvoiceName("")
              }}
              style={{
                backgroundColor: "#8B5CF6",
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
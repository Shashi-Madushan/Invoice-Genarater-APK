import TemplateSelector from "@/app/(invoice)/TemplateSelector"
import React, { useState } from "react"
import { Modal, Text, TouchableOpacity, View } from "react-native"

export default function HomeScreen() {
  const [templateSelectorVisible, setTemplateSelectorVisible] = useState(false)

  // Called when template selected
  const handleTemplateSelected = (templateId: string) => {
    setTemplateSelectorVisible(false)
    // TODO: handle invoice creation with templateId
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-purple-700">Home</Text>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 32,
          right: 24,
          zIndex: 100,
          backgroundColor: "#8B5CF6",
          borderRadius: 32,
          width: 54,
          height: 54,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
        onPress={() => setTemplateSelectorVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={{ color: "white", fontSize: 36, fontWeight: "bold" }}>+</Text>
      </TouchableOpacity>
      <Modal
        visible={templateSelectorVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setTemplateSelectorVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 40 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 16 }}>
            Select a Template
          </Text>
          <TemplateSelector
            onSelectTemplate={(templateId: string) => handleTemplateSelected(templateId)}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 40,
              right: 20,
              padding: 8,
              backgroundColor: "#eee",
              borderRadius: 8,
            }}
            onPress={() => setTemplateSelectorVisible(false)}
          >
            <Text style={{ color: "#8B5CF6", fontWeight: "bold" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from "react"
import { SafeAreaView, Text, View } from "react-native"

export default function TemplatesScreen() {
  // Simulate templates array (replace with real data)
  const templates = []

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        {templates.length === 0 ? (
          <View className="items-center">
            <MaterialCommunityIcons name="file-document-outline" size={64} color="#7C3AED" />
            <Text className="mt-4 text-xl font-semibold text-purple-700">No templates found</Text>
            <Text className="mt-2 text-base text-gray-500 text-center">You haven't created any templates yet. Tap the + button to add a new template and get started!</Text>
          </View>
        ) : (
          // ...existing code for showing templates...
          <Text className="text-2xl font-bold text-purple-700">Templates</Text>
        )}
      </View>
    </SafeAreaView>
  )
}

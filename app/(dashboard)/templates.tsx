import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from "react"
import { SafeAreaView, ScrollView, Text, View } from "react-native"
import Template1 from "../../components/templates/Template1-minimalModern"
import Template2 from "../../components/templates/Template2–CleanCorporate"

// Dummy invoice data for preview
const dummyData = {
  templateId: "",
  storeName: "Demo Store",
  logoUrl: "",
  date: "2024-06-01",
  items: [
    { name: "Item A", quantity: 2, price: 50, discount: 5 },
    { name: "Item B", quantity: 1, price: 100, discount: 10 },
  ],
  totals: { subtotal: 200, discount: 15, grandTotal: 185 },
  customerDetails: {
    name: "John Doe",
    address: "123 Main St",
    phone: "1234567890",
    email: "john@example.com",
  },
  shopDetails: {
    name: "Demo Store",
    address: "456 Business Rd",
    phone: "9876543210",
    email: "demo@store.com",
  },
}

const templates = [
  {
    id: "template_1",
    name: "Minimal Modern",
    description: "A clean, modern invoice template.",
    Component: Template1,
  },
  {
    id: "template_2",
    name: "Clean Corporate",
    description: "Professional corporate invoice style.",
    Component: Template2,
  },
  // ...add more templates as needed
]

export default function TemplatesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-center mt-8 mb-6">
        <MaterialCommunityIcons name="file-document-outline" size={32} color="#7C3AED" />
        <Text className="ml-3 text-3xl font-extrabold text-purple-700 tracking-tight">Templates</Text>
      </View>
      {templates.length === 0 ? (
        <View className="items-center">
          <MaterialCommunityIcons name="file-document-outline" size={64} color="#7C3AED" />
          <Text className="mt-4 text-xl font-semibold text-purple-700">No templates found</Text>
          <Text className="mt-2 text-base text-gray-500 text-center">You haven't created any templates yet. Tap the + button to add a new template and get started!</Text>
        </View>
      ) : (
        <ScrollView className="px-4 pb-8">
          {/* <Text className="text-2xl font-bold text-purple-700 mb-4">Templates</Text> */}
          {templates.map(template => (
            <View
              key={template.id}
              className="mb-6 p-4 bg-gray-100 rounded-lg shadow"
            >
              <Text className="text-lg font-semibold text-purple-800">{template.name}</Text>
              <Text className="mt-1 text-gray-600">{template.description}</Text>
              {/* Actual Template Preview */}
              <View className="mt-3">
                <template.Component data={{ ...dummyData, templateId: template.id }} />
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

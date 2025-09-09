import TemplateSelector from "@/app/(invoice)/TemplateSelector"
import React, { useState } from "react"
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function HomeScreen() {
  const [templateSelectorVisible, setTemplateSelectorVisible] = useState(false)

  // Dummy data for dashboard stats
  const invoiceCount = 24
  const templateCount = 5
  const totalClients = 12
  const totalRevenue = "$12,500"

  const handleTemplateSelected = (templateId: string) => {
    setTemplateSelectorVisible(false)
    // TODO: handle invoice creation with templateId
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-8">
        {/* Dashboard Title */}
        <Text className="text-2xl font-bold text-black mb-2">Dashboard</Text>
        <Text className="text-base text-gray-500 mb-6">
          Welcome back! Here is your business overview.
        </Text>

        {/* Dashboard Cards */}
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 bg-white rounded-xl shadow-md p-5 mr-2 border border-gray-100">
            <Text className="text-sm text-gray-500 mb-2">Invoices</Text>
            <Text className="text-3xl font-bold text-black mb-1">
              {invoiceCount}
            </Text>
            <Text className="text-xs text-purple-500 font-semibold">
              Total Created
            </Text>
          </View>
          <View className="flex-1 bg-white rounded-xl shadow-md p-5 ml-2 border border-gray-100">
            <Text className="text-sm text-gray-500 mb-2">Templates</Text>
            <Text className="text-3xl font-bold text-black mb-1">
              {templateCount}
            </Text>
            <Text className="text-xs text-purple-500 font-semibold">
              Available
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 bg-white rounded-xl shadow-md p-5 mr-2 border border-gray-100">
            <Text className="text-sm text-gray-500 mb-2">Clients</Text>
            <Text className="text-2xl font-bold text-black mb-1">
              {totalClients}
            </Text>
            <Text className="text-xs text-purple-500 font-semibold">Active</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl shadow-md p-5 ml-2 border border-gray-100">
            <Text className="text-sm text-gray-500 mb-2">Revenue</Text>
            <Text className="text-2xl font-bold text-black mb-1">
              {totalRevenue}
            </Text>
            <Text className="text-xs text-purple-500 font-semibold">
              This Month
            </Text>
          </View>
        </View>

        {/* Recent Activity Section */}
        <Text className="text-lg font-bold text-black mt-6 mb-2">
          Recent Activity
        </Text>
        <View className="bg-white rounded-xl shadow p-4 border border-gray-100 mb-16">
          <Text className="text-gray-500">No recent activity yet.</Text>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 w-[54px] h-[54px] bg-purple-500 rounded-full items-center justify-center shadow-lg"
        onPress={() => setTemplateSelectorVisible(true)}
        activeOpacity={0.8}
      >
        <Text className="text-white text-3xl font-bold">+</Text>
      </TouchableOpacity>

      {/* Template Selector Modal */}
      <Modal
        visible={templateSelectorVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setTemplateSelectorVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-white px-4">
          {/* Close Button */}
          <TouchableOpacity
            className="absolute top-4 right-5 bg-gray-200 px-3 py-1 rounded-md z-10"
            onPress={() => setTemplateSelectorVisible(false)}
          >
            <Text className="text-purple-600 font-bold">Close</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text className="text-xl font-bold text-center mt-12 mb-4">
            Select a Template
          </Text>

          {/* Template Selector Component */}
          <TemplateSelector onSelectTemplate={handleTemplateSelected} />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

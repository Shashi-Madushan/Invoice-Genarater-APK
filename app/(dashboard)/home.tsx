import TemplateSelector from "@/app/(invoice)/TemplateSelector"
import { getDashboardData } from "@/services/dashBoardService"
import React, { useEffect, useState } from "react"
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { getCurrentUser } from "@/services/authService"
export default function HomeScreen() {
  const [templateSelectorVisible, setTemplateSelectorVisible] = useState(false)
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function fetchDashboard() {
      const user = await getCurrentUser()
      if (!user) {
        setDashboard(null)
        setLoading(false)
        return
      }
      const userId = user.uid
      const data = await getDashboardData(userId)
      setDashboard(data)
      setLoading(false)
    }
    fetchDashboard()
  }, [])

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
              {loading ? "..." : dashboard?.totalInvoices}
            </Text>
            <Text className="text-xs text-purple-500 font-semibold">
              Total Created
            </Text>
          </View>
          <View className="flex-1 bg-white rounded-xl shadow-md p-5 ml-2 border border-gray-100">
            <Text className="text-sm text-gray-500 mb-2">Shops</Text>
            <Text className="text-3xl font-bold text-black mb-1">
              {loading ? "..." : dashboard?.totalShops}
            </Text>
            <Text className="text-xs text-purple-500 font-semibold">
              Total
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 bg-white rounded-xl shadow-md p-5 mr-2 border border-gray-100">
            <Text className="text-sm text-gray-500 mb-2">Revenue</Text>
            <Text className="text-2xl font-bold text-black mb-1">
              {loading ? "..." : `Rs. ${dashboard?.totalRevenue?.toLocaleString()}`}
            </Text>
            <Text className="text-xs text-purple-500 font-semibold">This Month</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl shadow-md p-5 ml-2 border border-gray-100">
            <Text className="text-sm text-gray-500 mb-2">Templates</Text>
            <Text className="text-3xl font-bold text-black mb-1">
              5
            </Text>
            <Text className="text-xs text-purple-500 font-semibold">
              Available
            </Text>
          </View>
        </View>

        {/* Recent Activity Section */}
        <Text className="text-lg font-bold text-black mt-6 mb-2">
          Recent Activity
        </Text>
        <View className="bg-white rounded-xl shadow p-4 border border-gray-100 mb-16">
          {loading ? (
            <Text className="text-gray-500">Loading...</Text>
          ) : dashboard?.recentActivities?.invoices?.length === 0 && dashboard?.recentActivities?.shops?.length === 0 ? (
            <Text className="text-gray-500">No recent activity yet.</Text>
          ) : (
            <>
              {dashboard?.recentActivities?.invoices?.map((inv: any) => (
                <View key={inv.id} className="mb-2">
                  <Text className="text-black font-semibold">Invoice: {inv.storeName}</Text>
                  <Text className="text-xs text-gray-500">Date: {inv.date}</Text>
                  <Text className="text-xs text-gray-500">Total: Rs. {inv.totals?.grandTotal}</Text>
                </View>
              ))}
              {dashboard?.recentActivities?.shops?.map((shop: any) => (
                <View key={shop.id} className="mb-2">
                  <Text className="text-black font-semibold">Shop: {shop.name}</Text>
                  <Text className="text-xs text-gray-500">Created: {shop.createdAt}</Text>
                </View>
              ))}
            </>
          )}
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

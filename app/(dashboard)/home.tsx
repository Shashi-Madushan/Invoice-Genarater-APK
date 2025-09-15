import TemplateSelector from "@/app/(invoice)/TemplateSelector"
import { getCurrentUser } from "@/services/authService"
import { getDashboardData } from "@/services/dashBoardService"
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useEffect, useState } from "react"
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function HomeScreen() {
  const [templateSelectorVisible, setTemplateSelectorVisible] = useState(false)
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function fetchDashboard() {
      const user = await getCurrentUser()
      setUser(user)
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
        {/* Greeting & Dashboard Title */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-black mb-1">Hi{user?.displayName ? `, ${user.displayName}` : ''} 👋</Text>
          <Text className="text-base text-gray-500">Welcome back! Here is your business overview.</Text>
        </View>

        {/* Dashboard Cards */}
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 bg-purple-50 rounded-xl boxShadow p-5 mr-2 border border-purple-100 flex-row items-center">
            <View className="bg-purple-200 rounded-full p-2 mr-3">
              <MaterialCommunityIcons name="file-document" size={28} color="#7C3AED" />
            </View>
            <View>
              <Text className="text-sm text-gray-500 mb-1">Invoices</Text>
              <Text className="text-2xl font-bold text-black mb-1">{loading ? "..." : dashboard?.totalInvoices}</Text>
              <Text className="text-xs text-purple-500 font-semibold">Total Created</Text>
            </View>
          </View>
          <View className="flex-1 bg-blue-50 rounded-xl boxShadow p-5 ml-2 border border-blue-100 flex-row items-center">
            <View className="bg-blue-200 rounded-full p-2 mr-3">
              <FontAwesome5 name="store" size={24} color="#2563EB" />
            </View>
            <View>
              <Text className="text-sm text-gray-500 mb-1">Shops</Text>
              <Text className="text-2xl font-bold text-black mb-1">{loading ? "..." : dashboard?.totalShops}</Text>
              <Text className="text-xs text-blue-500 font-semibold">Total</Text>
            </View>
          </View>
        </View>
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 bg-green-50 rounded-xl boxShadow p-5 mr-2 border border-green-100 flex-row items-center">
            <View className="bg-green-200 rounded-full p-2 mr-3">
              <Ionicons name="cash" size={28} color="#059669" />
            </View>
            <View>
              <Text className="text-sm text-gray-500 mb-1">Revenue</Text>
              <Text className="text-xl font-bold text-black mb-1">{loading ? "..." : `Rs. ${dashboard?.totalRevenue?.toLocaleString()}`}</Text>
              <Text className="text-xs text-green-600 font-semibold">This Month</Text>
            </View>
          </View>
          <View className="flex-1 bg-yellow-50 rounded-xl boxShadow p-5 ml-2 border border-yellow-100 flex-row items-center">
            <View className="bg-yellow-200 rounded-full p-2 mr-3">
              <MaterialCommunityIcons name="file-table" size={28} color="#F59E42" />
            </View>
            <View>
              <Text className="text-sm text-gray-500 mb-1">Templates</Text>
              <Text className="text-2xl font-bold text-black mb-1">5</Text>
              <Text className="text-xs text-yellow-600 font-semibold">Available</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity Section */}
        <Text className="text-lg font-bold text-black mt-8 mb-2">Recent Activity</Text>
        <View className="bg-white rounded-xl boxShadow p-4 border border-gray-100 mb-16">
          {loading ? (
            <Text className="text-gray-500">Loading...</Text>
          ) : dashboard?.recentActivities?.invoices?.length === 0 && dashboard?.recentActivities?.shops?.length === 0 ? (
            <View className="items-center py-6">
              <Ionicons name="information-circle-outline" size={32} color="#A1A1AA" />
              <Text className="text-gray-500 mt-2">No recent activity yet.</Text>
            </View>
          ) : (
            <>
              {dashboard?.recentActivities?.invoices?.map((inv: any) => (
                <View key={inv.id} className="mb-3 flex-row items-center">
                  <MaterialCommunityIcons name="file-document-outline" size={22} color="#7C3AED" className="mr-2" />
                  <View>
                    <Text className="text-black font-semibold">Invoice: {inv.storeName}</Text>
                    <Text className="text-xs text-gray-500">Date: {inv.date}</Text>
                    <Text className="text-xs text-gray-500">Total: Rs. {inv.totals?.grandTotal}</Text>
                  </View>
                </View>
              ))}
              {dashboard?.recentActivities?.shops?.map((shop: any) => (
                <View key={shop.id} className="mb-3 flex-row items-center">
                  <FontAwesome5 name="store" size={20} color="#2563EB" className="mr-2" />
                  <View>
                    <Text className="text-black font-semibold">Shop: {shop.name}</Text>
                    <Text className="text-xs text-gray-500">Created: {shop.createdAt}</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 w-[54px] h-[54px] bg-purple-500 rounded-full items-center justify-center boxShadow"
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

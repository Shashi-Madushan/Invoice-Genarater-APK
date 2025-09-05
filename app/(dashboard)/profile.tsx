import { logout } from "@/services/authService"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native"

export default function ProfileScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logout()
      router.replace("/logIn")
    } catch (err) {
      Alert.alert("Logout failed", "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-purple-700 mb-8">Profile</Text>
      <TouchableOpacity
        className="bg-purple-600 px-6 py-3 rounded-2xl"
        onPress={handleLogout}
        disabled={loading}
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg font-medium">Logout</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

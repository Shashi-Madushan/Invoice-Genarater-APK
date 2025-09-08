import { useAuth } from "@/context/authContext"
import { auth } from "@/firebaseConfig"
import { logout } from "@/services/authService"
import { MaterialIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { sendPasswordResetEmail } from "firebase/auth"
import React, { useState } from "react"
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native"

function getInitials(name?: string | null, email?: string | null) {
  if (name && name.trim()) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  if (email) return email[0].toUpperCase()
  return "U"
}

export default function ProfileScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

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

  const handleChangePassword = async () => {
    if (!user?.email) {
      Alert.alert("Error", "No email found for user.")
      return
    }
    setResetLoading(true)
    try {
      await sendPasswordResetEmail(auth, user.email)
      Alert.alert("Password Reset", "A password reset email has been sent to your email address.")
    } catch (err) {
      Alert.alert("Error", "Failed to send password reset email.")
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-gray-50 px-6 pt-12">
      <View className="items-center mb-6">
        {/* Avatar */}
        <View className="w-20 h-20 rounded-full bg-purple-600 items-center justify-center shadow-lg mb-2">
          <Text className="text-white text-3xl font-bold">
            {getInitials(user?.displayName, user?.email)}
          </Text>
        </View>
        <Text className="text-xl font-semibold text-gray-900">
          {user?.displayName || "User"}
        </Text>
        <Text className="text-base text-gray-500 mt-1">
          Welcome back!
        </Text>
      </View>
      <View className="bg-white rounded-2xl p-6 shadow-md mb-6">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="person" size={22} color="#7C3AED" />
          <Text className="ml-2 text-lg font-medium text-gray-800">Name</Text>
        </View>
        <Text className="ml-8 text-base text-gray-600 mb-4">{user?.displayName || "N/A"}</Text>
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="email" size={22} color="#7C3AED" />
          <Text className="ml-2 text-lg font-medium text-gray-800">Email</Text>
        </View>
        <Text className="ml-8 text-base text-gray-600">{user?.email || "N/A"}</Text>
      </View>
      <View className="w-full flex-row items-center mb-6">
        <View className="flex-1 h-px bg-gray-200" />
      </View>
      <View className="w-full">
        <TouchableOpacity
          className={`flex-row items-center justify-center bg-purple-100 px-6 py-3 rounded-2xl mb-4`}
          onPress={handleChangePassword}
          disabled={resetLoading}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <MaterialIcons name="lock-reset" size={22} color="#7C3AED" />
          {resetLoading ? (
            <ActivityIndicator color="#7C3AED" className="ml-2" />
          ) : (
            <Text className="ml-2 text-purple-700 text-lg font-medium text-center">Change Password</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center justify-center bg-purple-600 px-6 py-3 rounded-2xl"
          onPress={handleLogout}
          disabled={loading}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <MaterialIcons name="logout" size={22} color="#fff" />
          {loading ? (
            <ActivityIndicator color="#fff" className="ml-2" />
          ) : (
            <Text className="ml-2 text-white text-lg font-medium text-center">Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

import { useAuth } from "@/context/authContext"
import { useRouter } from "expo-router"
import React, { useEffect } from "react"
import { ActivityIndicator, View } from "react-native"

const Index = () => {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      router.replace(user ? "/home" : "/logIn")
    }
  }, [user, loading])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6B21A8" />
      </View>
    )
  }

  return null
}

export default Index
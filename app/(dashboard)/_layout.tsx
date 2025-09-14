import { MaterialIcons } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import React from "react"

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: undefined, // Remove inline style
        tabBarClassName:
          "absolute bottom-5 left-5 right-5 bg-white rounded-2xl h-16 px-2 border-0 shadow-lg flex-row items-center justify-between", // Tailwind classes
        tabBarIcon: ({ focused }) => {
          const name =
            route.name === "home"
              ? "home"
              : route.name === "history"
              ? "history"
              : route.name === "templates"
              ? "description"
              : route.name === "stores"
              ? "store"
              : "person"
          const color = focused ? "#7C3AED" : "#9CA3AF"
          return <MaterialIcons name={name as any} size={28} color={color} />
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="stores" options={{ title: "Manage Stores" }} />
      <Tabs.Screen name="templates" options={{ title: "Templates" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  )
}

export default DashboardLayout
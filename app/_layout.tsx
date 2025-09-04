import { AuthProvider } from "@/context/authContext"
import { LoaderProvider } from "@/context/loaderContext"
import { Slot } from "expo-router"
import React from "react"
import "./../global.css"

const RootLayout = () => {
  return (
    <LoaderProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </LoaderProvider>
  )
}

export default RootLayout
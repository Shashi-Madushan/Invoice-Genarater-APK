import { register } from "@/services/authService";
import { MaterialIcons } from "@expo/vector-icons"; // use Material icons (changed)
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const Register = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [password, setPasword] = useState<string>("")
  const [isLodingReg, setIsLoadingReg] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false) // new state

  const handleRegister = async () => {
    // basic client-side validation
    if (!email.trim() || !password) {
      Alert.alert("Missing fields", "Please enter both email and password.")
      return
    }
    if (isLodingReg) return
    setIsLoadingReg(true)
    await register(email, password)
      .then((res) => {
        console.log(res)
        router.back()
      })
      .catch((err) => {
        console.error(err)
        Alert.alert("Registration fail", "Somthing went wrong")
        // import { Alert } from "react-native"
      })
      .finally(() => {
        setIsLoadingReg(false)
      })
  }

  return (
    <View className="flex-1 bg-white justify-center p-6">
      <Text className="text-3xl font-bold mb-6 text-black text-center">
        Create Account
      </Text>

      {/* Email */}
      <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-4 shadow-sm">
        <MaterialIcons name="email" size={20} color="#6B21A8" />
        <TextInput
          placeholder="Email"
          className="flex-1 ml-3 text-black"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          accessible
          accessibilityLabel="Email"
        />
      </View>

      {/* Password */}
      <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-4 shadow-sm">
        <MaterialIcons name="lock" size={20} color="#6B21A8" />
        <TextInput
          placeholder="Password"
          className="flex-1 ml-3 text-black"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPasword}
          autoCapitalize="none"
          accessible
          accessibilityLabel="Password"
        />
        <Pressable onPress={() => setShowPassword((s) => !s)} accessibilityLabel="Toggle password visibility">
          <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={22} color="#6B21A8" />
        </Pressable>
      </View>

      <TouchableOpacity
        className={`p-4 rounded-2xl mt-2 ${isLodingReg ? "bg-purple-300" : "bg-purple-600"}`}
        onPress={handleRegister}
        disabled={isLodingReg}
        accessibilityRole="button"
      >
        {isLodingReg ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text className="text-center text-lg text-white font-medium">Register</Text>
        )}
      </TouchableOpacity>

      <Pressable onPress={() => router.back()} className="mt-4">
        <Text className="text-center text-black text-base">
          Already have an account? <Text className="text-purple-600">Login</Text>
        </Text>
      </Pressable>
    </View>
  )
}

export default Register
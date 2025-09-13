import { getCurrentUser } from "@/services/authService"
import { deleteInvoice, getInvoices } from "@/services/invoiceService"
import React, { useEffect, useState } from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default function HistoryScreen() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInvoices() {
      const user = await getCurrentUser()
      if (user?.uid) {
        const data = await getInvoices(user.uid)
        setInvoices(data)
      }
      setLoading(false)
    }
    fetchInvoices()
  }, [])

  async function handleDelete(invoiceId: string) {
    setLoading(true)
    try {
      const user = await getCurrentUser()
      if (user?.uid) {
        await deleteInvoice(user.uid, invoiceId)
        const data = await getInvoices(user.uid)
        setInvoices(data)
      }
    } catch (err) {
      console.error('Delete failed:', err)
    }
    setLoading(false)
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-center mt-6 mb-4">
        <MaterialCommunityIcons name="file-document-outline" size={28} color="#7C3AED" />
        <Text className="ml-2 text-2xl font-bold text-purple-700">Invoice History</Text>
      </View>
      {loading ? (
        <Text className="text-center text-gray-500">Loading...</Text>
      ) : (
        <ScrollView className="px-4">
          {invoices.length === 0 ? (
            <View className="items-center mt-16">
              <MaterialCommunityIcons name="file-remove-outline" size={48} color="#A1A1AA" />
              <Text className="text-center text-gray-400 mt-4 text-lg">No invoices found.</Text>
            </View>
          ) : (
            invoices.map((invoice) => (
              <TouchableOpacity
                key={invoice.id}
                className="mb-4"
                onPress={() => console.log(invoice)}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center p-4 bg-gray-100 rounded-lg shadow mb-2">
                  <MaterialCommunityIcons name="file-document" size={32} color="#7C3AED" className="mr-4" />
                  <View className="flex-1 mr-4">
                    <Text className="text-lg font-semibold text-purple-700 mb-1">{invoice.storeName}</Text>
                    <Text className="text-sm text-gray-700 mb-1">Customer: {invoice.customerDetails?.name}</Text>
                    <Text className="text-sm text-gray-600 mb-1">Date: {invoice.date}</Text>
                    <Text className="text-sm text-gray-600">Total: Rs. {invoice.totals?.grandTotal}</Text>
                  </View>
                  <View className="flex-row ml-2">
                    <TouchableOpacity onPress={() => console.log('edit', invoice.id)} className="mr-4" hitSlop={{top:8,bottom:8,left:8,right:8}}>
                      <MaterialCommunityIcons name="pencil" size={24} color="#6366F1" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(invoice.id)} className="ml-2" hitSlop={{top:8,bottom:8,left:8,right:8}}>
                      <MaterialCommunityIcons name="delete" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
